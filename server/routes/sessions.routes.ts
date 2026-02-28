import { Router } from "express";
import { getSessions, createSession } from "../controllers/session.controller";
import { completeSession } from "../controllers/session.controller";

const router = Router();

router.get("/", getSessions);
router.post("/", createSession);
router.patch("/:id", completeSession);

export default router;