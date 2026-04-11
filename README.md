cd vault-api
npm install



Then create a .env.development file with:
DATABASE_URL="file:./dev.db"

Then:
npm run dev        # runs on localhost:3000


You will also need DB Browser for SQLITE ( to manage the database_

Run Prisma migrations to create the DB tables: npx prisma migrate dev
