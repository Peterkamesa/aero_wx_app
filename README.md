# 🌦️ AeroWx – Aviation Weather Dashboard

## 1. Title & Objective

**Title:** *AeroWx – Building an Aviation Weather Dashboard with Next.js, Prisma & PostgreSQL*

### What technology did you choose?
- **Next.js (App Router)** – for full-stack React development  
- **Prisma ORM** – for database interaction  
- **PostgreSQL** – for storing weather observations  
- **React (Client Components)** – for interactivity  

### Why did you choose it?
- Next.js allows **server + client integration** in one framework  
- Prisma simplifies **database queries and schema management**  
- PostgreSQL is reliable for **structured meteorological data**  
- React enables **dynamic UI updates and user interactions**

### End Goal
To build a **web-based aviation weather dashboard** that:
- Captures METAR/SPECI/manual observations  
- Stores them in a database  
- Displays real-time weather metrics and history  
- Allows users to manage (create/delete) observations  

---

## 2. Quick Summary of the Technology

### What is it?
- **Next.js** is a React framework for building full-stack applications  
- **Prisma** is a type-safe ORM for working with databases  
- **PostgreSQL** is a relational database system  

### Where is it used?
- Web apps with **real-time dashboards**
- Data-driven platforms (analytics, weather, finance)

### Real-world example
- Aviation systems displaying **live METAR weather data at airports**

---

## 3. System Requirements

- **Operating System:** Windows / Linux / macOS  
- **Node.js:** v18 or later  
- **Package Manager:** npm or yarn  
- **Database:** PostgreSQL  
- **Code Editor:** VS Code (recommended)  

---

## 4. Installation & Setup Instructions

### Step 1: Clone the Repository

git clone https://github.com/your-username/aerowx.git
cd aerowx
### Step 2: Install Dependencies
npm install

### Step 3: Setup Environment Variables

Create a .env file:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/aerowx"

###Step 4: Setup Prisma
npx prisma generate
npx prisma migrate dev --name init

### Step 5: Run the Development Server
npm run dev

Visit:

http://localhost:3000

### 5. Minimal Working Example

### What does it do?

Creates a new weather observation and saves it to the database.

```javascript
// Create observation (server action)
export async function createObservation(formData: FormData) {
  const observationTime = new Date(formData.get('observation_time') as string)

  await prisma.weatherObservation.create({
    data: {
      observation_time: observationTime,
      message_type: 'METAR',
      air_temperature: 25,
    },
  })
}
```

### Expected Output
A new record is saved in the database
Dashboard updates automatically
Observation appears in the table/feed

### 7. Common Issues & Fixes

#### ❌ Prisma Client not generated

Error:

PrismaClientInitializationError

Fix:

npx prisma generate

#### ❌ Database connection failed

Cause: Wrong DATABASE_URL

Fix:

Check .env file
Ensure PostgreSQL is running

#### ❌ Page not updating after mutation

Cause: Cache not refreshed

Fix:

revalidatePath('/')

#### ❌ Form submission not working

Cause: Missing use client or incorrect handler

Fix:

Ensure component is client-side
Check onSubmit function

### 8. References

📘 Next.js Docs: https://nextjs.org/docs

📘 Prisma Docs: https://www.prisma.io/docs

📘 PostgreSQL Docs: https://www.postgresql.org/docs

🎥 YouTube: Next.js Full Course – https://www.youtube.com/watch?v=ZVnjOPwW4ZA

💡 StackOverflow: https://stackoverflow.com/