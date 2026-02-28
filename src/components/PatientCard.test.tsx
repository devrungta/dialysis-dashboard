import { render, screen } from "@testing-library/react";
import PatientCard from "./PatientCard";

const mockPatient = {
    id: "1",
    name: "Test Patient",
    age: 50,
    unitId: "A1",
    dryWeight: 70,
};

describe("PatientCard", () => {

    it("shows anomaly banner when anomaly exists", () => {
        const mockSession = {
            id: "s1",
            patientId: "1",
            startTime: "2026-02-28T10:00:00Z",
            endTime: "2026-02-28T14:00:00Z",
            preWeight: 73,
            postWeight: 75,
            systolicBP: 190,
            diastolicBP: 90,
            machineId: "M-101",
            notes: "Test",
            status: "completed" as const,
            anomalies: {
                excessWeightGain: true,
                highPostBP: false,
                abnormalDuration: false,
            },
        };

        render(
            <PatientCard patient={mockPatient} session={mockSession} />
        );

        expect(
            screen.getByText(/clinical anomaly detected/i)
        ).toBeInTheDocument();
    });

    it("does not show anomaly banner when no anomalies", () => {
        const mockSession = {
            id: "s2",
            patientId: "1",
            startTime: "2026-02-28T10:00:00Z",
            preWeight: 71,
            machineId: "M-101",
            status: "completed" as const,
            postWeight: 71,
            systolicBP: 120,
            diastolicBP: 80,
            endTime: "2026-02-28T14:00:00Z",
            notes: "Normal",
            anomalies: {
                excessWeightGain: false,
                highPostBP: false,
                abnormalDuration: false,
            },
        };

        render(
            <PatientCard patient={mockPatient} session={mockSession} />
        );

        expect(
            screen.queryByText(/clinical anomaly detected/i)
        ).not.toBeInTheDocument();
    });

});