# AWS S3 Configuration Guide for CloudDrive

## 🎯 **Required AWS S3 Configuration**

Your `.env` file currently has placeholder values that need to be replaced with actual AWS credentials:

```env
# CURRENT - NEEDS TO BE UPDATED:
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-clouddrive-bucket-name
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

## 📋 **Steps to Get AWS S3 Credentials**

### Step 1: Create AWS Account
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Sign up or sign in to your AWS account

### Step 2: Create S3 Bucket
1. Navigate to **S3 Service**
2. Click **"Create bucket"**
3. Enter bucket name (e.g., `clouddrive-yourname-2024`)
4. Select **Region**: `ap-south-1` (Mumbai) or your preferred region
5. Keep default settings, click **"Create bucket"**

### Step 3: Create IAM User for S3 Access
1. Go to **IAM Service** → **Users** → **"Create user"**
2. User name: `clouddrive-s3-user`
3. Select **"Attach policies directly"**
4. Search and attach **"AmazonS3FullAccess"** policy
5. Click **"Create user"**

### Step 4: Get Access Keys
1. Find your created user in IAM
2. Go to **"Security credentials"** tab
3. Click **"Create access key"**
4. Select **"Command Line Interface (CLI)"**
5. Copy **Access key ID** and **Secret access key**

## 🔧 **Update Your .env File**

Replace the placeholder values with your actual AWS credentials:

```env
# AWS S3 Configuration
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-actual-bucket-name-here
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_PRESIGNED_URL_EXPIRATION_MINUTES=30
```

## 🧪 **Test AWS Configuration**

After updating `.env`, test the configuration:

```bash
# Start backend (once PostgreSQL is fixed)
mvn spring-boot:run

# Test file upload via API
curl -X POST http://localhost:8080/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test.txt"
```

## ⚠️ **Security Notes**

1. **Never commit** `.env` file to version control
2. **Use IAM policies** with least privilege (not S3FullAccess for production)
3. **Enable bucket encryption** for production
4. **Set bucket policies** for public access if needed

## 🚀 **Quick Alternative: Use LocalStack**

For development without AWS costs:

```bash
# Install LocalStack
pip install localstack

# Start LocalStack with S3
localstack start -d

# Update .env for local development
AWS_REGION=us-east-1
AWS_S3_BUCKET=test-bucket
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_S3_ENDPOINT_URL=http://localhost:4566
```

## 📞 **Troubleshooting**

### Common Issues:
- **Access Denied**: Check IAM permissions
- **Bucket Not Found**: Verify bucket name and region
- **Invalid Credentials**: Double-check access keys
- **Network Timeout**: Check firewall and VPC settings

### Verification Commands:
```bash
# Test AWS CLI connection
aws s3 ls

# List your buckets
aws s3api list-buckets
```

---

**Next Steps**: Update your `.env` file with actual AWS S3 credentials, then you'll have full file upload functionality!
