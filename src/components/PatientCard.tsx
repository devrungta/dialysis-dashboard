import { Patient, DialysisSession } from "../types/patients";

interface Props {
    patient: Patient;
    session?: DialysisSession;
}

export default function PatientCard({ patient, session }: Props) {
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
        </div>
    );
}