# AWS Integration and Deployment Plan

Here is a complete, step-by-step plan to take your project from local storage to a cloud-based architecture using AWS. We'll break this down into three phases: **Account Creation & Setup**, **S3 Integration (File Storage)**, and **EC2 Deployment (Hosting)**.

---

### Phase 1: AWS Account & Security Setup

**Step 1: Create an AWS Free Tier Account**
1. Go to the [AWS Free Tier page](https://aws.amazon.com/free/).
2. Click **Create a Free Account** and fill in your email, password, and account name.
3. Provide your contact information (select "Personal" for the account type).
4. Enter your credit/debit card details. *(AWS requires this for identity verification. You will be charged a temporary ₹2/$1 hold that gets refunded. As long as you stay within the Free Tier limits, you won't be charged).*
5. Verify your phone number via SMS.
6. Select the **Basic Support - Free** plan and complete the registration.

**Step 2: Create an IAM User (Crucial for Security)**
*Never use your root account credentials inside your application.*
1. Log in to the AWS Management Console and search for **IAM** (Identity and Access Management).
2. Go to **Users** (on the left menu) → **Create user**.
3. Name the user (e.g., `clouddrive-app-user`). Do not give them AWS Console access.
4. On the permissions page, select **Attach policies directly**.
5. Search for and select: `AmazonS3FullAccess`.
6. Create the user.
7. Click on the newly created user, go to the **Security credentials** tab.
8. Scroll down to **Access keys** → **Create access key**.
9. Select **Application running outside AWS**, and click Next.
10. **IMPORTANT:** Copy the `Access key ID` and `Secret access key`. You will need these for your Spring Boot `.env` file. You won't be able to see the secret key again.

---

### Phase 2: S3 Bucket Setup & Code Integration (File Storage)

**Step 3: Create an S3 Bucket**
1. Search for **S3** in the AWS Console.
2. Click **Create bucket**.
3. Provide a unique bucket name (e.g., `clouddrive-storage-yourname`).
4. Select your preferred Region (e.g., `ap-south-1` for Mumbai).
5. **Object Ownership**: Leave as ACLs disabled.
6. **Block Public Access settings for this bucket**: Keep "Block *all* public access" **checked**. (We will use Pre-signed URLs for secure access, which is safer and perfectly fits your PRD).
7. Click **Create bucket**.

**Step 4: Update Your Backend Application**
We need to change your backend to upload/download files from S3 instead of your local `uploads/` folder.

1. **Add AWS SDK Dependency:**
   Add this to your `pom.xml`:
   ```xml
   <dependency>
       <groupId>software.amazon.awssdk</groupId>
       <artifactId>s3</artifactId>
       <version>2.20.162</version> <!-- Or latest version -->
   </dependency>
   ```
2. **Update your `.env` file:**
   ```env
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=clouddrive-storage-yourname
   AWS_ACCESS_KEY_ID=your_copied_access_key
   AWS_SECRET_ACCESS_KEY=your_copied_secret_key
   ```
3. **Rewrite `FileServiceImpl.java`:**
   We will need to update the methods:
   - `uploadFile`: Use AWS S3 `PutObjectRequest` instead of `Files.copy()`.
   - `downloadFile`: Return the S3 object data or return a Pre-Signed S3 URL.
   - `generateShareLink`: Use AWS S3 Presigner to generate a time-limited secure URL.
   - `deleteFile` (permanentlyDeleteFromTrash): Delete the object from the S3 bucket.

---

### Phase 3: EC2 Deployment (Hosting)

**Step 5: Launch an EC2 Instance**
1. Search for **EC2** in the AWS Console and click **Launch Instance**.
2. **Name:** `CloudDrive-Server`.
3. **OS Image:** Select **Ubuntu** (Ubuntu Server 24.04 or 22.04 LTS is fine).
4. **Instance Type:** Select `t2.micro` (Free Tier eligible).
5. **Key Pair:** Click **Create new key pair**. Name it `clouddrive-key`, select `.pem`, and click create. (This will download a file—keep it safe, you need it to connect to your server).
6. **Network Settings:**
   - Allow SSH traffic from Anywhere (to connect to the terminal).
   - Allow HTTP and HTTPS traffic from the internet.
   - *Custom TCP:* We'll need to open port `8080` (Spring Boot) and `5173`/`80` (React) later in the Security Group.
7. Click **Launch Instance**.

**Step 6: Setup the Server Environment**
1. Connect to your EC2 instance via SSH:
   ```bash
   ssh -i /path/to/clouddrive-key.pem ubuntu@<your-ec2-public-ip>
   ```
2. Once inside, install Java, Maven, and PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install openjdk-17-jdk maven postgresql postgresql-contrib -y
   ```
3. Setup the PostgreSQL Database exactly as you did locally (create the `clouddrive` database and `clouddrive_user`).

**Step 7: Deploy the Backend & Frontend**
1. **Transfer Code:** You can clone your GitHub repository directly onto the EC2 instance.
2. **Backend:** 
   - Add your `.env` file to the EC2 instance in the backend folder.
   - Run the backend in the background: `nohup mvn spring-boot:run > log.txt 2>&1 &`
3. **Frontend:**
   - Install Node.js on the EC2 instance.
   - Update your frontend API base URL to point to your EC2 Public IP instead of `localhost`.
   - Build the frontend: `npm install` then `npm run build`.
   - You can serve the frontend using a lightweight server like `nginx` or `pm2`.
