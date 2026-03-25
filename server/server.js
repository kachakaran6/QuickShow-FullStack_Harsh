import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

const app = express();
const port = 3000;

await connectDB();

// Stripe Webhooks Route
app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks,
);

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  // Development
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173", // Vite default port
  "http://localhost:4173", // Vite preview port
  // Production - Render
  "https://quickshow-fullstack-harsh.onrender.com",
  // Production - Vercel
  "https://quick-show-full-stack-harsh.vercel.app",
  "https://www.quick-show-full-stack-harsh.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or internal requests)
      // Also allow all development origins and production URLs
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS request from unauthorized origin: ${origin}`);
        callback(null, true); // Allow for now, can be stricter in future
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600, // Pre-flight cache for 10 minutes
  }),
);

app.use(clerkMiddleware());

// API Routes
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));
