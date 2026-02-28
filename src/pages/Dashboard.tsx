import { useQuery } from "@tanstack/react-query";
import { fetchPatients } from "../api/client";
import { Patient } from "../types/patients";

export default function Dashboard() {
    const { data, isLoading, error } = useQuery<Patient[]>({
        queryKey: ["patients"],
        queryFn: fetchPatients,
    });

    if (isLoading) return <p>Loading patients...</p>;
    if (error) return <p>Error loading patients.</p>;
    if (!data || data.length === 0) return <p>No patients scheduled today.</p>;

    return (
        <div>
            <h2>Today's Patients</h2>
            <ul>
                {data.map((patient) => (
                    <li key={patient.id}>{patient.name}</li>
                ))}
            </ul>
        </div>
    );
}