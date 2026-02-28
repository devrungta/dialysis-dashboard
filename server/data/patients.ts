export interface Patient {
    id: string;
    name: string;
    age: number;
    unitId: string;
    dryWeight: number;
    scheduledDate: string;
}

export const patients: Patient[] = [];