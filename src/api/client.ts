const BASE_URL = "http://localhost:5000/api";

export async function fetchPatients() {
    const res = await fetch(`${BASE_URL}/patients`);
    if (!res.ok) throw new Error("Failed to fetch patients");
    return res.json();
}

export async function fetchSessions(unitId: string) {
    const res = await fetch(`${BASE_URL}/sessions?unitId=${unitId}`);
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
}

export async function createSession(data: {
    patientId: string;
    startTime: string;
    preWeight: number;
    machineId: string;
}) {
    const res = await fetch(`http://localhost:5000/api/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create session");
    return res.json();
}

export async function completeSession(
    id: string,
    data: {
        postWeight: number;
        systolicBP: number;
        diastolicBP: number;
        endTime: string;
        notes: string;
    }
) {
    const res = await fetch(
        `http://localhost:5000/api/sessions/${id}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) throw new Error("Failed to complete session");
    return res.json();
}