# Quick Start Guide for CloudDrive Backend

## Prerequisites Checklist

### 1. PostgreSQL Setup
- [ ] PostgreSQL is installed and running
- [ ] Database `clouddrive` exists  
- [ ] User `clouddrive_user` exists with password `25scse2140006`

### 2. Environment Variables
- [ ] `.env` file exists with correct credentials

## Quick Setup Commands

### Step 1: Setup PostgreSQL Database
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Run these commands in psql:
CREATE USER clouddrive_user WITH PASSWORD '25scse2140006';
CREATE DATABASE clouddrive;
GRANT ALL PRIVILEGES ON DATABASE clouddrive TO clouddrive_user;
\c clouddrive
GRANT ALL ON SCHEMA public TO clouddrive_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO clouddrive_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO clouddrive_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO clouddrive_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO clouddrive_user;
\q
```

### Step 2: Verify Database Connection
```bash
# Test connection with new user
psql -U clouddrive_user -d clouddrive -h localhost -p 5432

# Should prompt for password: 25scse2140006
```

### Step 3: Start Application
```bash
cd clouddrive-backend
mvn spring-boot:run
```

## Current Configuration

Your `.env` file contains:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clouddrive
DB_USERNAME=clouddrive_user
DB_PASSWORD=25scse2140006
JWT_SECRET=OMWesIov6uWkUfkcifjIkNAyHep2nSzDlBlUH2zrivO
JWT_EXPIRATION_MS=86400000
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-clouddrive-bucket-name
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_PRESIGNED_URL_EXPIRATION_MINUTES=30
SERVER_PORT=8080
```

## Troubleshooting

### If Application Fails to Start:

1. **Check PostgreSQL Status:**
   ```bash
   pg_ctl status
   ```

2. **Verify Database Exists:**
   ```bash
   psql -U postgres -l
   \l clouddrive
   ```

3. **Test Connection:**
   ```bash
   psql -U clouddrive_user -d clouddrive -h localhost -p 5432
   ```

4. **Check Port Availability:**
   ```bash
   netstat -an | grep 5432
   ```

## Expected Output

When successful, you should see:
```
Starting CloudDriveApplication...
...
Started CloudDriveApplication on port 8080
```

## Next Steps After Success

1. Test authentication: `POST http://localhost:8080/auth/register`
2. Test API health: `GET http://localhost:8080/auth/health`
3. Start frontend: `cd ../clouddrive-frontend && npm run dev`
