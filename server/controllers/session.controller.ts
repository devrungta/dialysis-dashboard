import { Request, Response } from "express";
import { sessions, DialysisSession } from "../data/sessions";
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
        id: Math.random().toString(36).substring(2, 9),
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
    const updates = req.body;

    const session = sessions.find((s) => s.id === id);

    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }

    Object.assign(session, updates);
    if (updates.endTime) {
        session.status = "completed";
    }

    if (
        updates.postWeight !== undefined ||
        updates.systolicBP !== undefined ||
        updates.diastolicBP !== undefined ||
        updates.endTime !== undefined
    ) {
        const patient = patients.find((p) => p.id === session.patientId);

        if (patient) {
            session.anomalies = detectAnomalies(
                session,
                patient.dryWeight
            );
        }
    }

    res.json(session);
};