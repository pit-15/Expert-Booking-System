# ExpertHub | Real-Time Mentorship Booking System

ExpertHub is a full-stack platform that connects users with industry experts. The standout feature is its 
**Real-Time Availability Engine**, which ensures that as soon as a slot is booked, it updates instantly for all users
browsing the site without a page refresh.

**Watch the Demo Video**: https://youtu.be/1Qft5P5p6lU

---

## Key Features

- **Real-Time Slot Updates:** Integrated with **Socket.io** to reflect booking status across all clients instantly.
- **Dynamic Expert Discovery:** Search by name and filter by categories with optimized API queries.
- **Advanced Profile View:** Detailed expert profiles showcasing experience, ratings, and organized time-slot groupings.
- **Booking Management:** Users can track their booking history and status via email search.
- **Responsive UI:** A premium "Masterclass-style" interface built with **Tailwind CSS**.

---

## Tech Stack

### Frontend
- **React.js** (Hooks & Router)
- **Tailwind CSS** (Modern UI/UX)
- **Socket.io-client** (Real-time events)
- **Lucide React** (Iconography)

### Backend
- **Node.js & Express**
- **MongoDB (Atlas)** (Mongoose ODM)
- **Socket.io** (Server-side events)

---

## Local Setup

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas Account

---

### Backend Setup

```bash
cd backend
#key dependencies express, mongoose, socket.io, cors, dotenv
npm install 
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=7071
```

Start the backend server:

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
#key dependencies: axios, lucide-react, socket.io-client, tailwindcss
npm install
npm start
```

---

## Component Architecture

- **ExpertListing** – The main hub for finding and filtering mentors.
- **ExpertDetail** – Deep dive into expert experience and slot selection.
- **MyBookings** – Personal dashboard to track confirmed and pending sessions.
- **StatusBadge** – Reusable UI component for dynamic status styling.
