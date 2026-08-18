# 🪲 Beetle Frontend

Frontend application for **Beetle**, a social recommendation platform designed to help users discover movies, series, music, and books while interacting with friends.

The interface provides authentication, recommendation cards, personal history, profiles, social interactions, and a responsive user experience connected to the Beetle REST API.

## 🛠 Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Google OAuth**
* **Supabase Storage**
* **Vercel**

## ✨ Features

### Authentication

Users can:

* Create an account
* Sign in with email and password
* Sign in with Google
* Maintain their authenticated session
* Recover their password
* Sign out

Authentication communicates with the Beetle Spring Boot backend.

JWT authentication is handled through HTTP-only cookies.

### Recommendation Cards

Users can interact with recommendation cards for:

* 🎬 Movies
* 📺 Series
* 🎵 Music
* 📚 Books

The card experience allows users to express preferences and receive recommendations based on their selections.

### Recommendation History

Users have a personal history where they can:

* View recommendations
* Save recommendations
* Dismiss recommendations
* Navigate through previous activity

History data is retrieved from the backend with pagination support.

### Social Experience

Beetle includes social functionality such as:

* Searching for users
* Sending friend requests
* Accepting friend requests
* Viewing friends
* Viewing social activity

### Likes & Comments

Users can interact with content through:

* Likes
* Unlikes
* Comments
* Comment deletion

These interactions are persisted through the backend API.

### User Profiles

Users can manage profile information such as:

* Name
* Username
* Profile picture
* Biography
* Contact information
* Profile visibility

Profile images are stored using Supabase Storage.

## 🎨 UI / UX

Beetle uses a modern responsive interface built with:

* Tailwind CSS
* shadcn/ui
* Responsive layouts
* Dark visual styling
* Smooth transitions
* Interactive recommendation cards
* Mobile-friendly components

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

## 🏗 Architecture

The frontend uses the **Next.js App Router** architecture.

The application separates responsibilities between:

```text
Pages / Routes
      ↓
Components
      ↓
Frontend API layer
      ↓
Beetle Backend
```

TypeScript is used throughout the application to improve type safety and maintainability.

## 🔐 Authentication Flow

The frontend communicates with the Spring Boot authentication API.

The general authentication flow is:

```text
User
 ↓
Next.js
 ↓
Authentication API
 ↓
Spring Security
 ↓
JWT HTTP-only Cookie
 ↓
Authenticated Session
```

Because the authentication token is stored as an HTTP-only cookie, frontend JavaScript does not need direct access to the JWT.

Google authentication is also integrated using Google OAuth.

## 🪲 Backend Wake-Up Experience

The production backend uses free-tier infrastructure and may sleep after periods of inactivity.

To prevent the application from appearing frozen during a cold start, Beetle provides a dedicated loading experience when an authentication request takes longer than expected.

When necessary, users see a Beetle-branded loading screen while the backend becomes available.

The interface automatically continues once the request completes.

When the backend is already running, this loading experience does not interfere with normal authentication.

This keeps infrastructure-specific behavior separated from the normal user experience.

## 🖼 Media Storage

Profile images are managed using **Supabase Storage**.

The frontend communicates with the appropriate application services while maintaining the separation between:

```text
Application Data → PostgreSQL

Media Storage → Supabase Storage
```

## 🚀 Deployment

The frontend is deployed using **Vercel**.

The production architecture is:

```text
Browser
   ↓
Vercel / Next.js
   ↓
Beetle REST API
   ↓
Spring Boot
   ↓
PostgreSQL
```

The project uses free-tier infrastructure because Beetle is a personal portfolio project.

## 🖥 Running Locally

### Requirements

Install:

* Node.js
* npm

Clone the repository and install dependencies:

```bash
npm install
```

Configure the required environment variables.

Example:

```env
NEXT_PUBLIC_API_URL=your_backend_url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit production secrets or private credentials.

Start the development server:

```bash
npm run dev
```

Then open the local development environment in your browser.

## 📦 Production Build

Create a production build with:

```bash
npm run build
```

Run the production build locally with:

```bash
npm start
```

## 🌐 Backend Integration

The frontend communicates with the Beetle backend through REST APIs.

Main API areas include:

```text
Authentication
Users
Profiles
Preferences
Recommendations
History
Friends
Friend Requests
Likes
Comments
```

Requests requiring authentication use the existing cookie-based authentication flow.

## 🔑 Environment Variables

Environment-specific configuration is kept outside the source code.

Typical frontend variables include:

```text
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Sensitive backend credentials must never be exposed through `NEXT_PUBLIC_*` variables.

## 🎯 Project Purpose

Beetle was created as a personal full-stack software engineering project to demonstrate:

* Next.js application development
* React
* TypeScript
* Responsive UI development
* REST API integration
* Authentication flows
* Google OAuth
* Social application functionality
* State management
* Cloud deployment
* Full-stack integration
* Production debugging

## 🔗 Backend

The frontend is designed to work together with the separate **Beetle Backend** repository.

Keeping frontend and backend separated allows both applications to be developed, deployed, and maintained independently.

## 📌 Status

**Beetle Frontend is feature complete for the current project scope.**

The current focus is stability, usability, and maintaining a clean full-stack architecture rather than continuously expanding the feature set.

---

Built as part of the **Beetle** project. 🪲

