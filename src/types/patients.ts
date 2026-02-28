export type SessionStatus = "not_started" | "in_progress" | "completed";

export interface DialysisSession {
    id: string;
    patientId: string;
    startTime: string;
    endTime?: string;
    preWeight: number;
    postWeight?: number;
    systolicBP?: number;
    diastolicBP?: number;
    machineId: string;
    notes?: string;
    status: SessionStatus;
    anomalies: {
        excessWeightGain: boolean;
        highPostBP: boolean;
        abnormalDuration: boolean;
    };
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    unitId: string;
    dryWeight: number;
}