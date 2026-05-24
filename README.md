# NavidMediCare

NavidMediCare is a doctor appointment manager for browsing doctors, booking visits, managing patient appointments, and reviewing completed consultations.

## Live Site

Client-side live URL:https://doctor-appointment-manager-sable.vercel.app/

## Repositories

- Client GitHub Repository: https://github.com/mmizan24/Doctor-appoinment-maganer
- Server GitHub Repository: https://github.com/mmizan24/doctor-server

## Features

- Browse top-rated doctors with specialty, experience, location, rating, and consultation fee details.
- Search and sort available doctors by name, rating, fee, and experience.
- View detailed doctor profiles with hospital, education, language, availability, and patient reviews.
- Book appointments through a responsive form connected to the appointments API.
- Manage bookings from a patient dashboard with sorting, editing, deleting, and review submission.
- Authenticate with email/password or real GitHub OAuth powered by Better Auth.
- Switch between light and dark themes with readable, theme-aware UI colors.

## Tech Stack

- Next.js
- React
- Tailwind CSS
- MongoDB
- Better Auth

## Environment Variables

Create a `.env` file and set:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
MONGODB_URI=your-mongodb-uri
MONGODB_DB=doctor_manager
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## GitHub OAuth Callback URL

In the GitHub OAuth app settings, set the Authorization callback URL to match
the domain in `BETTER_AUTH_URL`:

```bash
http://localhost:3000/api/auth/callback/github
```

For the deployed Vercel site, use:

```bash
https://doctor-appointment-manager-sable.vercel.app/api/auth/callback/github
```

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.
