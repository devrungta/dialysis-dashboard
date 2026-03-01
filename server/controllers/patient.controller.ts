import { Request, Response } from "express";
import { patients } from "../data/patients";

export const getPatients = (req: Request, res: Response) => {
    const today = new Date().toISOString().split("T")[0];

    const todaysPatients = patients.filter(
        (p) => p.scheduledDate === today
    );

    res.json(todaysPatients);
};

export const createPatient = (req: Request, res: Response) => {
    const { name, age, dryWeight, unitId } = req.body;

    if (!name || !age || !dryWeight) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const newPatient = {
        id: Date.now().toString(),
        name,
        age,
        dryWeight,
        unitId: unitId || "A1",
        scheduledDate: new Date().toISOString().split("T")[0],
    };

    patients.push(newPatient);

    res.status(201).json(newPatient);
};