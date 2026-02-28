import express from "express";
import cors from "cors";
import patientRoutes from "./routes/patient.routes";
import sessionRoutes from "./routes/sessions.routes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/sessions", sessionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});