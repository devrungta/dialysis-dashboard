import { CLINICAL_THRESHOLDS } from "../config/clinical.config";
import { DialysisSession } from "../data/sessions";

export interface SessionAnomalies {
    excessWeightGain: boolean;
    highPostBP: boolean;
    abnormalDuration: boolean;
}

export function detectAnomalies(
    session: DialysisSession,
    dryWeight: number
): SessionAnomalies {

    const weightGain =
        session.postWeight !== undefined
            ? session.postWeight - dryWeight
            : 0;

    const excessWeightGain =
        weightGain > CLINICAL_THRESHOLDS.MAX_INTERDIALYTIC_GAIN_KG;

    const highPostBP =
        session.systolicBP !== undefined &&
        session.systolicBP >
        CLINICAL_THRESHOLDS.MAX_POST_DIALYSIS_SYSTOLIC_BP;

    let abnormalDuration = false;

    if (session.startTime && session.endTime) {
        const durationMinutes =
            (new Date(session.endTime).getTime() -
                new Date(session.startTime).getTime()) /
            60000;

        abnormalDuration =
            durationMinutes <
            CLINICAL_THRESHOLDS.MIN_SESSION_DURATION_MINUTES ||
            durationMinutes >
            CLINICAL_THRESHOLDS.MAX_SESSION_DURATION_MINUTES;
    }

    return {
        excessWeightGain,
        highPostBP,
        abnormalDuration,
    };
}