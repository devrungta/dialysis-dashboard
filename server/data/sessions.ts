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
    status: "not_started" | "in_progress" | "completed";
}

export const sessions: DialysisSession[] = [];