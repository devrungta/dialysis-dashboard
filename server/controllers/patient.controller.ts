import { Request, Response } from "express";
import { patients } from "../data/patients";

export const getPatients = (req: Request, res: Response) => {
    res.json(patients);
};