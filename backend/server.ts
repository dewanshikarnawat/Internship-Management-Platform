import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import apiRouter from './routes/index.js';

// Models (for seeding / cleanup logic)
import InternshipModel from './models/Internship.js';
import ActivityLogModel from './models/ActivityLog.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', apiRouter);

// Optional: cleanup function (safe version)
async function clearCollections() {
  try {
    console.log("Cleaning old collections...");

    await InternshipModel.deleteMany({});
    await ActivityLogModel.deleteMany({});

    console.log("Collections cleaned successfully.");
  } catch (error) {
    console.error("Error cleaning collections:", error);
  }
}

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();

    await clearCollections();

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();