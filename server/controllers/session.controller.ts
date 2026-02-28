import { Request, Response } from "express";
import { sessions, DialysisSession } from "../data/sessions";
import { v4 as uuidv4 } from "uuid";

export const getSessions = (req: Request, res: Response) => {
    const { unitId } = req.query;

    if (!unitId) {
        return res.status(400).json({ message: "unitId is required" });
    }

    res.json(sessions);
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