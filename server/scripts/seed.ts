import { patients, Patient } from "../data/patients";
import { sessions, DialysisSession } from "../data/sessions";
import { v4 as uuidv4 } from "uuid";
import { detectAnomalies } from "../services/anomaly.service";

const UNIT_ID = "A1";

function today() {
    return new Date().toISOString().split("T")[0];
}

function randomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const names = [
    "Ramesh Kumar",
    "Suresh Patel",
    "Anita Sharma",
    "Rahul Mehta",
    "Priya Nair",
    "Vikram Singh",
    "Neha Joshi",
    "Arjun Verma",
    "Kavita Rao",
    "Manoj Iyer",
];

export function seedData() {
    patients.length = 0;
    sessions.length = 0;

    names.forEach((name, index) => {
        const dryWeight = randomBetween(55, 80);

        const patient: Patient = {
            id: String(index + 1),
            name,
            age: randomBetween(40, 75),
            unitId: UNIT_ID,
            dryWeight,
            scheduledDate: today(),
        };

        patients.push(patient);

        const statusRoll = Math.random();

        // 30% not started
        if (statusRoll < 0.3) return;

        const startTime = new Date();
        startTime.setHours(startTime.getHours() - 4);

        const session: DialysisSession = {
            id: uuidv4(),
            patientId: patient.id,
            startTime: startTime.toISOString(),
            preWeight: dryWeight + randomBetween(1, 4),
            machineId: "M-" + randomBetween(100, 105),
            status: statusRoll < 0.6 ? "in_progress" : "completed",
        };

        if (session.status === "completed") {
            const endTime = new Date();
            const postWeight = dryWeight + randomBetween(0, 4);
            const systolic = randomBetween(120, 200);

            session.endTime = endTime.toISOString();
            session.postWeight = postWeight;
            session.systolicBP = systolic;
            session.diastolicBP = randomBetween(70, 100);
            session.notes = "Seeded auto-session";

            session.anomalies = detectAnomalies(
                session,
                patient.dryWeight
            );
        }

        sessions.push(session);
    });

    console.log("Seeded patients:", patients.length);
    console.log("Seeded sessions:", sessions.length);
}