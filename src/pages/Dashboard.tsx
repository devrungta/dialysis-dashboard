import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    
    const [showAddModal, setShowAddModal] = useState(false);
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        name: "",
        age: "",
        dryWeight: "",
    });
    const addPatientMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("http://localhost:5000/api/patients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    age: Number(form.age),
                    dryWeight: Number(form.dryWeight),
                    unitId: "A1",
                }),
            });

            if (!res.ok) throw new Error("Failed");

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            setShowAddModal(false);
            setForm({ name: "", age: "", dryWeight: "" });
        },
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

    return (<>
        <div className="app-container">
            <div className="dashboard-layout">
            <div className="dashboard-header">
            <h2 className="page-title">Today's Patients</h2>
            <button
                className="action-button"
                onClick={() => setShowAddModal(true)}
            >
                + Add Patient
            </button>

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
        {showAddModal && (
            <div
                className="modal-overlay"
                onClick={() => setShowAddModal(false)}
            >
                <div
                    className="modal-card"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3>Add Patient (Today)</h3>

                    <input
                        className="modal-input"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <input
                        className="modal-input"
                        placeholder="Age"
                        type="number"
                        value={form.age}
                        onChange={(e) =>
                            setForm({ ...form, age: e.target.value })
                        }
                    />

                    <input
                        className="modal-input"
                        placeholder="Dry Weight (kg)"
                        type="number"
                        value={form.dryWeight}
                        onChange={(e) =>
                            setForm({ ...form, dryWeight: e.target.value })
                        }
                    />

                    <div className="modal-actions">
                        <button
                            className="modal-button secondary"
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            className="modal-button primary"
                            disabled={
                                !form.name ||
                                !form.age ||
                                !form.dryWeight ||
                                addPatientMutation.isPending
                            }
                            onClick={() => addPatientMutation.mutate()}
                        >
                            {addPatientMutation.isPending
                                ? "Adding..."
                                : "Add Patient"}
                        </button>
                    </div>
                </div>
            </div>
        )}
        
    </>
    );
}