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