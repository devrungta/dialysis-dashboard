import { useQuery } from "@tanstack/react-query";
import { fetchPatients, fetchSessions } from "../api/client";
import { Patient, DialysisSession } from "../types/patients";
import { useState } from "react";


const UNIT_ID = "A1";

export default function Dashboard() {
    const [onlyAnomalies, setOnlyAnomalies] = useState(false);

    const {
        data: patients,
        isLoading: loadingPatients,
        error: patientsError,
    } = useQuery<Patient[]>({
        queryKey: ["patients"],
        queryFn: fetchPatients,
    });

    const {
        data: sessions,
        isLoading: loadingSessions,
        error: sessionsError,
    } = useQuery<DialysisSession[]>({
        queryKey: ["sessions", UNIT_ID],
        queryFn: () => fetchSessions(UNIT_ID),
    });

    if (loadingPatients || loadingSessions) {
        return <p>Loading dashboard...</p>;
    }

    if (patientsError || sessionsError) {
        return <p>Something went wrong while fetching data.</p>;
    }

    if (!patients) return <p>No patients found.</p>;

    const patientRows = patients.map((patient) => {
        const session = sessions?.find(
            (s) => s.patientId === patient.id
        );

        const hasAnomaly =
            session?.anomalies &&
            Object.values(session.anomalies).some(Boolean);

        return {
            patient,
            session,
            hasAnomaly,
        };
    });

    const filteredRows = onlyAnomalies
        ? patientRows.filter((row) => row.hasAnomaly)
        : patientRows;

    return (
        <div>
            <h2>Today's Patients</h2>

            <label>
                <input
                    type="checkbox"
                    checked={onlyAnomalies}
                    onChange={() => setOnlyAnomalies(!onlyAnomalies)}
                />
                Show only anomalies
            </label>

            {filteredRows.length === 0 && (
                <p>No matching patients.</p>
            )}

            <ul>
                {filteredRows.map(({ patient, session, hasAnomaly }) => (
                    <li
                        key={patient.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            marginBottom: "0.5rem",
                            backgroundColor: hasAnomaly ? "#ffe6e6" : "white",
                        }}
                    >
                        <strong>{patient.name}</strong>

                        {!session && <p>Status: Not Started</p>}

                        {session && (
                            <>
                                <p>Status: {session.status}</p>
                                <p>Pre-weight: {session.preWeight}</p>
                                {session.postWeight && (
                                    <p>Post-weight: {session.postWeight}</p>
                                )}
                                {session.systolicBP && (
                                    <p>
                                        BP: {session.systolicBP}/
                                        {session.diastolicBP}
                                    </p>
                                )}
                                {hasAnomaly && (
                                    <p style={{ color: "red" }}>
                                        ⚠ Anomaly Detected
                                    </p>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}