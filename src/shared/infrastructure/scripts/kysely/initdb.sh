#!/bin/sh
set -e

echo "⏳ Creating database and user..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    -- Create database if it doesn't exist
    SELECT 'CREATE DATABASE $POSTGRES_DATABASE'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$POSTGRES_DATABASE')\gexec
    
    -- Create user if it doesn't exist
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$POSTGRES_USER') THEN
            CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';
        ELSE
            -- Update password if user exists
            ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';
        END IF;
    END
    \$\$;
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DATABASE TO $POSTGRES_USER;
EOSQL

echo "✅ Database and user created!"
