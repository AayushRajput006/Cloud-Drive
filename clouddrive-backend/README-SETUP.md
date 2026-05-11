# CloudDrive Database Setup Guide

## Prerequisites
- PostgreSQL 13+ installed and running
- Maven installed
- Java 17+ installed

## Step 1: Set Up PostgreSQL Database

### Option A: Using psql command line
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Run the setup commands
\i database-setup.sql
```

### Option B: Manual setup
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create user
CREATE USER clouddrive_user WITH PASSWORD 'your_secure_password_here';

-- Create database
CREATE DATABASE clouddrive;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE clouddrive TO clouddrive_user;

-- Connect to database and grant schema privileges
\c clouddrive
GRANT ALL ON SCHEMA public TO clouddrive_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO clouddrive_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO clouddrive_user;
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your actual credentials:
```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clouddrive
DB_USERNAME=clouddrive_user
DB_PASSWORD=your_actual_secure_password

# JWT Configuration (generate a secure 32+ character key)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRATION_MS=86400000

# AWS S3 Configuration (optional for now)
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-clouddrive-bucket-name
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_PRESIGNED_URL_EXPIRATION_MINUTES=30
```

## Step 3: Test Database Connection

Run the application to test the connection:
```bash
mvn spring-boot:run
```

The application will:
1. Connect to PostgreSQL using the configured credentials
2. Automatically create/update the database schema
3. Start the server on port 8080

## Step 4: Verify Database Tables

After running the application, you can verify the tables were created:
```sql
\c clouddrive
\dt
```

You should see:
- users
- files
- folders

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running: `pg_ctl status`
- Check credentials in `.env` file
- Ensure database user has proper privileges
- Check firewall settings if connecting to remote database

### Schema Issues
- The application uses `spring.jpa.hibernate.ddl-auto=update`
- Tables will be created automatically on first run
- If you need to reset: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`

### Environment Variables Not Loading
- Ensure `.env` file is in the backend root directory
- Check that Spring Boot is reading the variables (check startup logs)
- On Windows, ensure no special characters in file path

## Security Notes

1. **Never commit `.env` file** to version control
2. Use strong, unique passwords for database
3. Generate a secure JWT secret (32+ characters)
4. Consider using environment-specific configurations for production
5. Use SSL/TLS for database connections in production

## Production Considerations

For production deployment:
1. Use environment variables instead of `.env` file
2. Configure connection pooling appropriately
3. Enable SSL database connections
4. Set up database backups
5. Configure proper logging and monitoring
