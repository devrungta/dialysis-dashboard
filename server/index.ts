import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.routes";
import sessionRoutes from "./routes/sessions.routes";
import { seedData } from "./scripts/seed";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/sessions", sessionRoutes);

seedData();
export default app;