# task tracker

A professional, production-ready Task Tracker web application. It features a client-side **`localStorage` database engine** for seamless hosting on **GitHub Pages**, a native **Drag-and-Drop Kanban Board**, **Bulk Action Operations**, and a custom high-contrast **Neo-brutalist styling system** with full light/dark theme support.

The project also retains its original modular Node.js/Express REST API backend for MERN stack integration.

---

## 🚀 Key Features

*   **Native Drag-and-Drop Kanban Board**: Organizes tasks across three columns: **Pending**, **In Progress**, and **Completed**. Cards display a drop outline, and columns highlight on drag-over.
*   **Bulk Selection & Sticky Action Bar**: Select multiple task cards via header checkboxes to reveal a floating action panel at the bottom. Batch-move task status or delete selected items instantly.
*   **Neo-brutalist Styling System**: Modern retro-inspired UI featuring flat solid shadows (`4px 4px 0px 0px`), stark black borders, zero-radius inputs, and premium Google Fonts (**DM Sans** and **Space Mono**).
*   **Persistent Client-Side Database**: Swapped backend dependencies for a robust client-side `localStorage` mock engine, complete with simulated network latency (150ms), status aggregations, pagination, and multi-field query searching.
*   **Automated GitHub Pages Deployments**: CI/CD integration using GitHub Actions (`deploy.yml`) to compile and publish code directly on every commit push.

---

## 1. Project Architecture & Folder Structure

The project decouples frontend and backend layers:
*   **Backend (MVC)**: Express & Node.js serve a REST API with MongoDB/Mongoose. Schema models feature query indices and validation checks.
*   **Frontend (Component-Based)**: React SPA built with Vite. React Context manages global state, while `localStorage` serves as the client-side database.

```text
duck/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD GitHub Pages deployment workflow
├── backend/
│   ├── config/db.js              # MongoDB database connection
│   ├── controllers/taskController.js # Controllers (CRUD & aggregation stats)
│   ├── models/Task.js            # Mongoose models and query indexes
│   ├── routes/taskRoutes.js      # REST API router
│   ├── middleware/
│   │   ├── errorHandler.js       # Global exception interceptor middleware
│   │   └── validator.js          # express-validator schemas
│   ├── seed.js                   # MongoDB data seeder script
│   └── server.js                 # Server entry file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Toasts
│   │   │   ├── dashboard/        # Stat cards grid & progress meter
│   │   │   └── tasks/            # TaskCard, TaskList, TaskFilters, Modals
│   │   ├── context/TaskContext.jsx # Global React state manager
│   │   ├── hooks/useDebounce.js  # Search input rate-limiter hook
│   │   ├── services/api.js       # LocalStorage simulation and CRUD routes
│   │   ├── App.jsx               # Main page layout wire
│   │   ├── main.jsx              # React mounting root
│   │   └── index.css             # Neo-brutalist theme and styling variables
│   ├── index.html                # App template
│   └── vite.config.js            # Vite configuration with relative base path
└── README.md                     # Documentation
```

---

## 2. API Design & Database Schema

### Database Schema (MongoDB Mongoose)
*   **title**: `String` (Required, trim, max 100 chars)
*   **description**: `String` (Optional, trim, max 500 chars)
*   **status**: `String` (Enum: `Pending`, `In Progress`, `Completed`; Default: `Pending`)
*   **priority**: `String` (Enum: `Low`, `Medium`, `High`; Default: `Medium`)
*   **dueDate**: `Date` (Required)
*   **timestamps**: Adds `createdAt` and `updatedAt` automatic logs.

### RESTful Endpoints (`/api/v1`)
*   `POST /tasks` - Create a new task.
*   `GET /tasks` - Fetch filtered, sorted, and paginated tasks.
*   `GET /tasks/:id` - Fetch details for a specific task.
*   `PUT /tasks/:id` - Modify task fields.
*   `DELETE /tasks/:id` - Deletes a task.
*   `GET /tasks/stats/summary` - Aggregate metrics for dashboard progress trackers.

---

## 3. Installation & Run Guide

### Running the Frontend (LocalStorage Mode)
1. Navigate into the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local server:
   ```bash
   npm run dev
   ```
   *The client interface will run on http://localhost:5173.*

### Running the Backend (MERN Stack Mode)
1. Navigate to the backend folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure your environment: Create a `.env` file with `PORT=5000` and `MONGODB_URI=mongodb://127.0.0.1:27017/builder-task-tracker`.
3. Seed the local MongoDB database:
   ```bash
   node seed.js
   ```
4. Run the API:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000.*

---

## 4. Deployment Guide

### Deploying to GitHub Pages (Static Hosting)
1. Go to your repository settings on GitHub (**Settings** ➜ **Pages**).
2. Set the build source branch to **`gh-pages`** and folder to **`/ (root)`**.
3. To deploy updates manually from your console, run:
   ```bash
   cd frontend
   npm run deploy
   ```
   *Alternatively, pushing commits to your `main` branch will trigger the automated GitHub Actions workflow to build and host the site.*

---

## 5. Technical Interview Questions

### Q1. How did you implement native HTML5 drag-and-drop on the Kanban board?
*Answer*: We added `draggable="true"` attributes to the task cards and registered the `onDragStart` event to pass the card ID using `e.dataTransfer.setData('text/plain', id)`. The columns define `onDragOver` (calling `e.preventDefault()` to allow drops) and `onDrop`. When dropped, the column retrieves the card ID and triggers an API call (or localStorage update) to update the status. We also utilize CSS hover selectors to dynamically highlight target columns during a drag event.

### Q2. How does the localStorage mock engine simulate the MongoDB backend?
*Answer*: The service layer intercepts all query requests and performs memory-efficient array operations:
1. **Filtering**: Checks matches on status and priority.
2. **Search**: Matches strings against titles and descriptions using case-insensitive checks.
3. **Sorting**: Sorts tasks by date strings or creation timestamps.
4. **Pagination**: Computes slice bounds (`(page - 1) * limit`) and returns metadata like `totalPages` and `hasNextPage` matching standard REST API signatures.
5. **Latency**: Emits a `Promise` delay of 150ms to verify skeleton animations.

---

## 6. Future Improvements
1. **User Authentication**: Add JWT (JSON Web Tokens) or OAuth (Google, GitHub) to secure tasks per user.
2. **Subtask Checklists**: Allow nested task checklists inside individual cards.
3. **Email Reminders**: Integrate nodemailer or SendGrid to send notifications 24 hours before a task's due date.
4. **Progress Analytics**: Incorporate Chart.js/Recharts to visualize task burn-down rates and completion trends.
