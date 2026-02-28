import { detectAnomalies } from "./anomaly.service";

describe("Anomaly Detection", () => {
    it("detects excess weight gain", () => {
        const session: any = {
            startTime: "2026-02-28T10:00:00Z",
            endTime: "2026-02-28T14:00:00Z",
            postWeight: 75,
            systolicBP: 120,
        };

        const result = detectAnomalies(session, 70);

        expect(result.excessWeightGain).toBe(true);
    });

    it("detects high BP", () => {
        const session: any = {
            startTime: "2026-02-28T10:00:00Z",
            endTime: "2026-02-28T14:00:00Z",
            postWeight: 71,
            systolicBP: 190,
        };

        const result = detectAnomalies(session, 70);

        expect(result.highPostBP).toBe(true);
    });

    it("returns no anomalies for normal case", () => {
        const session: any = {
            startTime: "2026-02-28T10:00:00Z",
            endTime: "2026-02-28T14:00:00Z",
            postWeight: 71,
            systolicBP: 130,
        };

        const result = detectAnomalies(session, 70);

        expect(result.excessWeightGain).toBe(false);
        expect(result.highPostBP).toBe(false);
    });
});