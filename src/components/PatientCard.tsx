import { Patient, DialysisSession } from "../types/patients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, completeSession } from "../api/client";
import { useState } from "react";

interface Props {
    patient: Patient;
    session?: DialysisSession;
}

export default function PatientCard({ patient, session }: Props) {
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);
    const [preWeightInput, setPreWeightInput] = useState("");

    const [formData, setFormData] = useState({
        postWeight: "",
        systolicBP: "",
        diastolicBP: "",
        notes: "",
    });
    const queryClient = useQueryClient();
    const createMutation = useMutation({
        mutationFn: createSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
        },
    });
    const completeMutation = useMutation({
        mutationFn: ({ id, data }: any) =>
            completeSession(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sessions"] });
        },
    });
    const hasAnomaly =
        session?.anomalies &&
        Object.values(session.anomalies).some(Boolean);

    const status = session ? session.status : "not_started";

    return (
        <div
            style={{
                border: hasAnomaly ? "1px solid #ff4d4f" : "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: hasAnomaly ? "#fff5f5" : "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{patient.name}</strong>

                <span
                    style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        backgroundColor:
                            status === "completed"
                                ? "#e6ffed"
                                : status === "in_progress"
                                    ? "#fff7e6"
                                    : "#f0f0f0",
                        color:
                            status === "completed"
                                ? "#237804"
                                : status === "in_progress"
                                    ? "#ad6800"
                                    : "#595959",
                    }}
                >
                    {status.replace("_", " ").toUpperCase()}
                </span>
            </div>

            <p style={{ fontSize: "0.85rem", color: "#666" }}>
                Dry Weight: {patient.dryWeight} kg
            </p>

            {session && (
                <>
                    <p>Pre-weight: {session.preWeight} kg</p>

                    {session.postWeight && (
                        <p>Post-weight: {session.postWeight} kg</p>
                    )}

                    {session.systolicBP && (
                        <p>
                            BP: {session.systolicBP}/{session.diastolicBP}
                        </p>
                    )}
                </>
            )}

            {hasAnomaly && (
                <div
                    style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem",
                        backgroundColor: "#fff1f0",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        color: "#a8071a",
                    }}
                >
                    ⚠ Clinical anomaly detected
                </div>
            )}

            {!session && (
                <button onClick={() => setShowStartModal(true)}>
                    Start Session
                </button>
            )}

            {session?.status === "in_progress" && (
                <button
                    onClick={() => setShowCompleteModal(true)}
                    style={{ marginTop: "0.5rem" }}
                >
                    Complete Session
                </button>
            )}
            {showCompleteModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            width: "320px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}
                    >
                        <h3>Complete Session</h3>

                        <input
                            placeholder="Post Weight"
                            type="number"
                            value={formData.postWeight}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    postWeight: e.target.value,
                                })
                            }
                        />

                        <input
                            placeholder="Systolic BP"
                            type="number"
                            value={formData.systolicBP}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    systolicBP: e.target.value,
                                })
                            }
                        />

                        <input
                            placeholder="Diastolic BP"
                            type="number"
                            value={formData.diastolicBP}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    diastolicBP: e.target.value,
                                })
                            }
                        />

                        <textarea
                            placeholder="Notes"
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                })
                            }
                        />

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button onClick={() => setShowCompleteModal(false)}>
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    completeMutation.mutate({
                                        id: session!.id,
                                        data: {
                                            postWeight: Number(formData.postWeight),
                                            systolicBP: Number(formData.systolicBP),
                                            diastolicBP: Number(formData.diastolicBP),
                                            endTime: new Date().toISOString(),
                                            notes: formData.notes,
                                        },
                                    });

                                    setShowCompleteModal(false);
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showStartModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            width: "320px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}
                    >
                        <h3>Start Session</h3>

                        <input
                            type="number"
                            placeholder="Pre-Dialysis Weight"
                            value={preWeightInput}
                            onChange={(e) => setPreWeightInput(e.target.value)}
                        />

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button onClick={() => setShowStartModal(false)}>
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    createMutation.mutate({
                                        patientId: patient.id,
                                        startTime: new Date().toISOString(),
                                        preWeight: Number(preWeightInput),
                                        machineId: "M-101",
                                    });

                                    setPreWeightInput("");
                                    setShowStartModal(false);
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}