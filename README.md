# Full-Stack Developer Portfolio

A modern, full-stack personal developer portfolio built with Next.js, Express.js, Firebase, and Supabase. The portfolio includes a fully functional public-facing website and a secure Admin Dashboard to manage all content dynamically.

## Features

- **Public Portfolio**: Beautiful, responsive, and animated UI displaying projects, skills, achievements, blog posts, and certifications.
- **Admin Dashboard**: Secure, authenticated admin area to effortlessly create, read, update, and delete (CRUD) portfolio data.
- **Dynamic Data**: All content is served dynamically via a REST API from a NoSQL database.
- **Media Management**: Direct image and file uploads to cloud storage via the Admin Panel.
- **Dark Mode**: Fully supported light/dark mode with modern UI aesthetics and smooth transitions.
- **Contact System**: Messages from the public site are sent directly to the Admin Dashboard.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion & GSAP
- **State Management**: Zustand
- **Icons**: Lucide React & React Icons
- **Rich Text**: Tiptap Editor (for blog posts)

### Backend
- **Framework**: Node.js with Express.js
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth (JWT verification)
- **Storage**: Supabase Storage (for images and PDF resumes)
- **File Uploads**: Multer (Memory Storage)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Firebase Account (Project ID, Client Email, Private Key)
- Supabase Account (URL, API Key)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="your_private_key"
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `.env.example`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Architecture

- The **Frontend** acts as the presentation layer. It communicates with Firebase directly for Authentication (logging the admin in), but sends all data requests (Projects, Blogs, Uploads) to the custom Node.js API.
- The **Backend API** acts as the secure middleman. It verifies the Admin's JWT token, communicates with Firestore for text data, and uploads files securely to Supabase.
