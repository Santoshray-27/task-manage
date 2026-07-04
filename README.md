# Builder Task Tracker (MERN Stack)

A professional, production-ready Task Tracker web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring modern ES6+ standards, clean MVC architecture on the backend, component-based state architecture on the frontend, full CRUD capabilities, instant UI synchronization, dark/light mode toggling, and input sanitization.

---

## 1. Project Architecture & Folder Structure

The project decouples frontend and backend layers to promote scalability:
- **Backend (MVC)**: Express & Node.js serve a REST API. Schema management is handled through Mongoose models. Inputs are validated before entering database models.
- **Frontend (Component-Based)**: React SPA built with Vite. React Context handles global state synchronization, Axios maps HTTP transactions, and custom CSS variables facilitate responsive and theme changes.

```
duck/
├── backend/
│   ├── config/db.js              # Database connection
│   ├── controllers/taskController.js # Task controllers (CRUD & aggregation stats)
│   ├── models/Task.js            # Mongoose model and indices
│   ├── routes/taskRoutes.js      # Express REST router
│   ├── middleware/
│   │   ├── errorHandler.js       # Express global exception interceptor
│   │   └── validator.js          # express-validator schemas
│   ├── utils/apiResponse.js      # Standard JSON response utilities
│   ├── .env                      # Local server secrets
│   └── server.js                 # Server root entry
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Toasts
│   │   │   ├── dashboard/        # Stat cards grid & progress meter
│   │   │   └── tasks/            # TaskCard, TaskList, TaskFilters, Form/Delete modals
│   │   ├── context/TaskContext.jsx # Global MERN state manager
│   │   ├── hooks/useDebounce.js  # Optimizes live searches
│   │   ├── services/api.js       # Axios client
│   │   ├── utils/helpers.js      # Date & overdue validation helpers
│   │   ├── App.jsx               # UI layout wire
│   │   ├── main.jsx              # App entry mount
│   │   └── index.css             # Dark/Light CSS design tokens
│   └── index.html
└── README.md                     # Documentation
```

---

## 2. API Design & Database Schema

### Database Schema (MongoDB Mongoose)
- **title**: `String` (Required, trim, max 100 chars)
- **description**: `String` (Optional, trim, max 500 chars)
- **status**: `String` (Enum: `Pending`, `In Progress`, `Completed`; Default: `Pending`)
- **priority**: `String` (Enum: `Low`, `Medium`, `High`; Default: `Medium`)
- **dueDate**: `Date` (Required)
- **timestamps**: Adds `createdAt` and `updatedAt` automatic logs.
- **index**: Text index on `{ title: "text", description: "text" }` for partial text match.

### RESTful Endpoints (`/api/v1`)
- `POST /tasks` - Create a new task (validated status, priority, and title).
- `GET /tasks` - Fetch tasks matching queries: `?search=term&status=Pending&priority=High&sortBy=dueDate:asc&page=1&limit=6`.
- `GET /tasks/:id` - Fetch details for a specific task.
- `PUT /tasks/:id` - Modify task fields (with full sanitization).
- `DELETE /tasks/:id` - Deletes a task.
- `GET /tasks/stats/summary` - Aggregate metrics (calculates total counts and status groupings).

---

## 3. Installation & Run Guide

### Prerequisite
Ensure you have [Node.js](https://nodejs.org) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### Running the Backend
1. Navigate into the backend folder:
   ```bash
   cd backend
   ```
2. Make sure you have created your local env configuration `.env` file (set `PORT=5000` and `MONGODB_URI`).
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000.*

### Running the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The interface runs on http://localhost:5173 (or similar port indicated by Vite).*

---

## 4. Deployment Guide

### Database: MongoDB Atlas (Free Cloud DB)
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and spin up a free M0 tier shared cluster.
2. In Database Access, create a user with read/write privileges.
3. In Network Access, allow access from anywhere (`0.0.0.0/0` - required for dynamic cloud servers like Render).
4. Retrieve the connection string (e.g. `mongodb+srv://<user>:<password>@cluster.mongodb.net/taskdb?retryWrites=true&w=majority`).
5. Paste this connection string in your production environment variables as `MONGODB_URI`.

### Backend: Render (Free Web Service)
1. Create an account on [Render](https://render.com).
2. Connect your Git repository.
3. Select **New Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your Atlas cluster URI connection string*
5. Deploy. You will receive an API URL (e.g. `https://task-tracker-api.onrender.com`).

### Frontend: Vercel (Free Hosting)
1. Sign up on [Vercel](https://vercel.com).
2. Select **Add New Project** and connect your repository.
3. Configure the settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: *Your Render backend API URL (e.g. `https://task-tracker-api.onrender.com/api/v1`)*
5. Click **Deploy**. Vercel will build your static files and publish the React application to a public URL.

---

## 5. Testing Checklist (Before Production)

### 1. Functional Features
- [ ] Create Task: Check that empty titles or missing due dates show inline error messages.
- [ ] Task Details: Confirm modal renders editing states with initial values correctly mapped.
- [ ] Inline Update: Verify changing status from the inline selector on the task card instantly recalculates stats.
- [ ] Delete Guard: Ensure the delete confirmation modal prevents accidental button triggers.

### 2. Edge Cases & Client Checks
- [ ] Overdue Marker: Check if selecting a date in the past turns the date text red and displays the warning icon.
- [ ] Search Debounce: Verify that typing "OAuth" queries the API only once after you stop typing (check Network logs).
- [ ] Pagination: Check that increasing items-per-page (e.g. from 6 to 12) updates grid sizes and recalculates total pages.
- [ ] Empty State: Delete all tasks to confirm the dynamic onboarding illustration and CTA buttons render.

### 3. Server & DB Validation
- [ ] Server Validations: Try sending a POST request via Postman with an invalid date or description over 500 chars to verify standard `400 Bad Request` payloads return.
- [ ] DB Index: Verify search speeds are optimal under higher loads using the text regex match.
- [ ] Global Error Interception: Verify requesting a non-existent ObjectId (`/tasks/12345`) returns a clean `400 Invalid format` message instead of throwing node process stack traces.

---

## 6. Technical Interview Questions

### Q1. What is debouncing, and how does it optimize web application performance?
*Answer*: Debouncing is a rate-limiting technique that delays executing a function until a specified period of inactivity has elapsed. In our project, typing inside the search input box updates a local input state instantly (preventing latency in rendering keystrokes), but delays updating the context filter state (which triggers the API request) by 400ms. If a user types "Database", it triggers only one API request instead of eight individual requests, reducing network congestion and database query load.

### Q2. How did you structure the MERN app to handle server-side errors, and how does the frontend render them?
*Answer*: 
1. The backend implements a centralized Express global error handler middleware.
2. It parses DB schema violations (Validation Errors, duplicate fields, CastErrors) and formats them into a standard error payload containing field-specific error messages.
3. The frontend Axios service captures this `400 Bad Request` block. 
4. The React form components catch this array, map the errors to a local `fieldErrors` object state, and render descriptive messages directly beneath the corresponding inputs.

### Q3. Why did you choose React Context API over Redux or Zustand for this project?
*Answer*: React Context API is built directly into React, making it a lightweight option that doesn't add external bundle dependencies. Because this project manages a unified task list and related modal triggers, Context is more than sufficient. For larger-scale applications with frequent, high-performance state updates, a library like Zustand or Redux Toolkit would be preferred to prevent unnecessary component tree re-renders.

### Q4. How does Mongoose prevent database injections and validate inputs?
*Answer*: Mongoose schemas restrict write inputs by strictly casting values to defined types. In addition, the backend utilizes `express-validator` at the route level to sanitize text (using `.trim()`) and enforce strict requirements (such as matching enum values or verifying ISO8601 date formats) before payloads ever reach Mongoose query processes.

---

## 7. Resume-Ready Description

**Title**: Full-Stack Developer - Builder Task Tracker Web App
- **Core Stack**: MongoDB, Express.js, React.js, Node.js (MERN), RESTful API, CSS, Axios, Lucide, Vite.
- **Key Contributions**:
  - Engineered a modular Node/Express RESTful API using MVC design patterns, incorporating global exception middleware and schema validations with `express-validator` to guarantee clean inputs.
  - Implemented complex Mongoose aggregation pipelines to calculate task status metrics (Total, Completed, Pending, In Progress), supporting a live summary dashboard on the frontend.
  - Built a responsive React client utilizing Context API, custom hooks (`useDebounce`), and CSS Variables to facilitate a seamless Light/Dark mode toggle.
  - Created advanced UI workflows including inline status updates, live paginated result grids, animated skeleton loaders, and server-side validation error mapping.

---

## 8. Future Improvements
1. **User Authentication**: Incorporate JWT (JSON Web Tokens) or OAuth (Google, GitHub logins) to secure tasks per user.
2. **Subtasks & Checklists**: Allow nested subtasks under each main card with individual progress tracking.
3. **Email Reminders**: Integrate nodemailer or SendGrid to send notifications 24 hours before a task's due date.
4. **Drag-and-Drop Kanban**: Replace the task grid with a Kanban board (e.g., using `@hello-pangea/dnd`) to drag cards between status columns.
