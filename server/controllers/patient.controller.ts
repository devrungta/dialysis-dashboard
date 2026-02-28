import { Request, Response } from "express";
import { patients } from "../data/patients";

export const getPatients = (req: Request, res: Response) => {
    const today = new Date().toISOString().split("T")[0];

    const todaysPatients = patients.filter(
        (p) => p.scheduledDate === today
    );

    res.json(todaysPatients);
};