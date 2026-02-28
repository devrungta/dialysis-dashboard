/**
 * @jest-environment jsdom
 */
import { Patient, DialysisSession } from "../types/patients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, completeSession } from "../api/client";
import { useState, useEffect } from "react";
import "../styles/PatientCard.css";
import "../styles/modal.css";

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
    const closeAllModals = () => {
        setShowStartModal(false);
        setShowCompleteModal(false);
    };
    useEffect(() => {
        if (showStartModal || showCompleteModal) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    }, [showStartModal, showCompleteModal]);
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

    return (<>
        <div className="patient-card">
            <div className="patient-header">
                <div className="patient-name">{patient.name}</div>
                <div className={`status-badge status-${status}`}>
                    {status.replace("_", " ").toUpperCase()}
                </div>
            </div>

            <div className="patient-meta">
                Dry Weight: {patient.dryWeight} kg
            </div>

            {session && (
                <>
                    <div>Pre-weight: {session.preWeight} kg</div>
                    {session.postWeight && (
                        <div>Post-weight: {session.postWeight} kg</div>
                    )}
                    {session.systolicBP && (
                        <div>
                            BP: {session.systolicBP}/{session.diastolicBP}
                        </div>
                    )}
                </>
            )}
            

            {showStartModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
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

            {showCompleteModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3>Complete Session</h3>

                        <input
                            className="modal-input"
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
                            className="modal-input"
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
                            className="modal-input"
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
                            className="modal-input"
                            placeholder="Notes"
                            value={formData.notes}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                })
                            }
                        />

                        <div className="modal-actions">
                            <button
                                className="modal-button secondary"
                                onClick={() => setShowCompleteModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="modal-button primary"
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

            {hasAnomaly && (
                <div className="anomaly-banner">
                    ⚠ Clinical anomaly detected
                </div>
            )}

            {!session && (
                <button
                    className="action-button"
                    onClick={() => {
                        setShowCompleteModal(false);
                        setShowStartModal(true);
                    }}
                >
                    Start Session
                </button>
            )}

            {session?.status === "in_progress" && (
                <button
                    className="action-button"
                    onClick={() => {
                        setShowStartModal(false);
                        setShowCompleteModal(true);
                    }}
                >
                    Complete Session
                </button>
            )}
        </div>
    </>
    );
}