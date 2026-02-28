import { useQuery } from "@tanstack/react-query";
import { fetchPatients, fetchSessions } from "../api/client";
import { Patient, DialysisSession } from "../types/patients";
import { useState } from "react";
import PatientCard from "../components/PatientCard";
import "../styles/dashboard.css";

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
        const patientSessions = sessions?.filter(
            (s) => s.patientId === patient.id
        );

        const session = patientSessions?.[patientSessions.length - 1];

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
        <div className="app-container">
            <div className="dashboard-layout">
            <div className="dashboard-header">
            <h2 className="page-title">Today's Patients</h2>

            <label className="filter-toggle">
                <input
                    type="checkbox"
                    checked={onlyAnomalies}
                    onChange={() => setOnlyAnomalies(!onlyAnomalies)}
                />
                Show only anomalies
                    </label>
                </div>

            {filteredRows.length === 0 && (
                <p>No matching patients.</p>
            )}

            <ul className="patient-list">
                {filteredRows.map(({ patient, session }) => (
                    <li key={patient.id}>
                        <PatientCard
                            patient={patient}
                            session={session}
                        />
                    </li>
                ))}
            </ul></div>
        </div>
    );
}