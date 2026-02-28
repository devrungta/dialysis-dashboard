import { Request, Response } from "express";
import { sessions, DialysisSession } from "../data/sessions";
import { v4 as uuidv4 } from "uuid";
import { patients } from "../data/patients";
import { detectAnomalies } from "../services/anomaly.service";

export const getSessions = (req: Request, res: Response) => {
    const { unitId } = req.query;

    if (!unitId) {
        return res.status(400).json({ message: "unitId is required" });
    }

    const filtered = sessions.filter((session) => {
        const patient = patients.find(
            (p) => p.id === session.patientId
        );
        return patient?.unitId === unitId;
    });

    res.json(filtered);
};

export const createSession = (req: Request, res: Response) => {
    const {
        patientId,
        startTime,
        preWeight,
        machineId,
    } = req.body;

    if (!patientId || !startTime || !preWeight || !machineId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const newSession: DialysisSession = {
        id: uuidv4(),
        patientId,
        startTime,
        preWeight,
        machineId,
        status: "in_progress",
    };

    sessions.push(newSession);

    res.status(201).json(newSession);
};
export const completeSession = (req: Request, res: Response) => {
    const { id } = req.params;
    const { postWeight, systolicBP, diastolicBP, endTime, notes } = req.body;

    const session = sessions.find((s) => s.id === id);

    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }

    session.postWeight = postWeight;
    session.systolicBP = systolicBP;
    session.diastolicBP = diastolicBP;
    session.endTime = endTime;
    session.notes = notes;
    session.status = "completed";

    const patient = patients.find((p) => p.id === session.patientId);

    if (patient) {
        session.anomalies = detectAnomalies(session, patient.dryWeight);
    }

    res.json(session);
};