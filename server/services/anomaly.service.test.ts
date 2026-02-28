import { detectAnomalies } from "./anomaly.service";

describe("detectAnomalies", () => {

    it("detects excess weight gain", () => {
        const session: any = {
            startTime: "2026-02-28T10:00:00Z",
            endTime: "2026-02-28T14:00:00Z",
            postWeight: 75,
            systolicBP: 120,
        };

        const result = detectAnomalies(session, 70);

        expect(result.excessWeightGain).toBe(true);
        expect(result.highPostBP).toBe(false);
    });

    it("detects high systolic BP", () => {
        const session: any = {
            startTime: "2026-02-28T10:00:00Z",
            endTime: "2026-02-28T14:00:00Z",
            postWeight: 71,
            systolicBP: 190,
        };

        const result = detectAnomalies(session, 70);

        expect(result.highPostBP).toBe(true);
    });

    it("detects abnormal duration", () => {
        const session: any = {
            startTime: "2026-02-28T10:00:00Z",
            endTime: "2026-02-28T11:00:00Z", // 60 min
            postWeight: 71,
            systolicBP: 120,
        };

        const result = detectAnomalies(session, 70);

        expect(result.abnormalDuration).toBe(true);
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
        expect(result.abnormalDuration).toBe(false);
    });

});