# Backend (skylark-backend)

## Quick start (local)
1. Copy `.env` into backend/ and set DATABASE_URL and JWT_SECRET.
2. Start Postgres (see docker-compose in monorepo root).
3. Run: npm install
4. Run: npx prisma generate
5. Run Prisma migrate:

<!--  -->
we have to install posgress locally
brew install postgresql@15
brew services start postgresql@15
or.  brew services restart postgresql@15` to restart.

now while setting up the posgress locally
abhishekjha@Abhisheks-MacBook-Pro ~ % psql -U abhishekjha -d postgres
psql (15.14 (Homebrew))
Type "help" for help.

postgres=# -- create the skylark database
CREATE DATABASE skylark;

-- create an admin user with password
CREATE USER admin WITH PASSWORD 'admin123';

-- grant privileges to admin
GRANT ALL PRIVILEGES ON DATABASE skylark TO admin;
CREATE DATABASE
CREATE ROLE
GRANT
postgres=# CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';
CREATE ROLE
postgres=# /q
postgres-# \q

<!-- this is for seed -->
Created admin user: admin password: password123


<!--  -->
   npx prisma migrate dev --name init
1. Seed initial user:
   npm run seed
2. Start in dev:
   npm run dev


   <!-- regarding calling api for the backend  -->
   <!-- Login to get JWT -->
   curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

<!-- Create a camera -->
  curl -X POST http://localhost:4000/api/cameras \
  -H "Authorization: Bearer JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Entrance","rtspUrl":"rtsp://example.com/live","location":"Gate"}'

<!-- Get all cameras -->
  curl -X GET http://localhost:4000/api/cameras \
  -H "Authorization: Bearer JWT_TOKEN_HERE"


<!-- Update camera -->
  curl -X PUT http://localhost:4000/api/cameras/1 \
  -H "Authorization: Bearer JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"enabled":false}'

  <!--  Delete camera -->
  curl -X DELETE http://localhost:4000/api/cameras/1 \
  -H "Authorization: Bearer JWT_TOKEN_HERE"

  <!-- Post an aler -->
  curl -X POST http://localhost:4000/api/alerts \
  -H "Authorization: Bearer JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"cameraId":1,"snapshotUrl":"http://example.com/face1.png","metadata":{"faces":2}}'

  <!-- Fetch alerts -->

  curl -X GET "http://localhost:4000/api/alerts?cameraId=1&page=1&limit=5" \
  -H "Authorization: Bearer JWT_TOKEN_HERE"

  <!-- trigger an alert via wss -->
  curl -X POST http://localhost:4000/api/alerts \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cameraId":1,"snapshotUrl":"http://example.com/test.png","metadata":{"faces":1}}'