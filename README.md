# Nyan Job Board

[![Deploy with Vercel](https://vercel.com/button)](https://nyan-job-board.vercel.app/)

**Live Demo: [https://nyan-job-board.vercel.app/](https://nyan-job-board.vercel.app/)**

A full-stack job board built with Next.js, Supabase, Clerk, and Inngest. This project serves as a comprehensive example of modern web development practices.

## 🌟 Project Overview

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: Clerk for user/organization management and social login.
- **Database**: Supabase PostgreSQL as the primary database.
- **ORM**: Drizzle ORM for type-safe database access and migrations.
- **Background Jobs & Events**: Inngest to handle asynchronous tasks, cron jobs, and webhooks from Clerk.
- **File Uploads**: UploadThing for handling file storage (e.g., user resumes).
- **Email Service**: Resend for sending transactional emails (e.g., notifications).
- **AI Features**: Google Gemini for AI-powered functionalities, integrated via an Inngest agent.

## ✅ Features

- **Multi-tenancy**: Team-based organizations with role-based permissions.
- **Job Listings**: Full CRUD (Create, Read, Update, Delete) operations for job listings.
- **Application Pipeline**: Job seekers can apply for jobs, and employers can manage and rate applications.
- **Email Notifications**: Daily email summaries and notifications for users and organizations.
- **Asynchronous Processing**: Inngest manages cron jobs for scheduled tasks and handles events from Clerk webhooks reliably.
- **Production Ready**: Includes data caching strategies, environment variable validation, and a robust database migration workflow.

---

## 🚀 Getting Started: Running Locally

Follow these steps to set up and run the project on your local machine.

### 1. Prerequisites

- **Node.js**: Version 20.x or higher.

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/nyan-job-board.git
cd nyan-job-board
```

### 3. Install Dependencies

```bash
npm install --force
```

### 4. Set Up Environment Variables

1.  Create a new file named `.env.local` in the root of the project.
2.  Copy the contents from `.env.example` (if it exists) or add the following variables.
3.  Fill in the values from your service providers (Supabase, Clerk, etc.).

```env
# Supabase Database
DATABASE_URL="postgresql://..." # Important: Use the Pooling connection string from Supabase (port 6543)

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Inngest
INNGEST_EVENT_KEY="ek_..."
INNGEST_SIGNING_KEY="signkey_..."

# Services
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
RESEND_API_KEY="re_..."
GEMINI_API_KEY="..."

# App
SERVER_URL="http://localhost:3000" # For local development
```

### 5. Set Up the Database

Run the Drizzle ORM command to push the schema to your Supabase database. This will create all the necessary tables.

```bash
npm db:push
```

### 6. Run the Development Servers

You need to run **two separate terminal sessions** for the application to work correctly.

**Terminal 1: Start the Next.js App**

```bash
npm run dev
```
Your application will be available at **http://localhost:3000**.

**Terminal 2: Start the Inngest Dev Server**

The Inngest server handles all background jobs and webhook events (like `user.created` from Clerk).

```bash
npm run inngest
```
This will open up the Inngest Dev UI at **http://localhost:8288**.

---

## 🛠️ Other Useful Commands

### Database Management (Drizzle)

- **View database in browser**: Opens Drizzle Studio, a GUI for your database.
  ```bash
  npm db:studio
  ```
- **Create a migration**: If you change the schema in `drizzle/schema.ts`.
  ```bash
  npm db:migrate
  ```

### Code Quality

- **Build the project for production**:
  ```bash
  npm run build
  ```

## 🌐 Deployment

This project is deployed on **Vercel**.

1.  Set all the environment variables in the Vercel project settings. For `SERVER_URL`, use your production URL (e.g., `https://nyan-job-board.vercel.app`).
2.  Ensure the `DATABASE_URL` is the Supabase pooling URL (port 6543).
3.  Push your code to trigger a deployment.
4.  Set up your Clerk webhooks to point to your Inngest production URL to process events.

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Webhooks Guide](https://clerk.com/docs/users/webhooks)
- [Inngest Documentation](https.inngest.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
