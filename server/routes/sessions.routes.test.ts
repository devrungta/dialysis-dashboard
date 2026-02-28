import request from "supertest";
import app from "../index";
import { patients } from "../data/patients";

describe("POST /api/sessions", () => {

    beforeEach(() => {
        patients.length = 0;
        patients.push({
            id: "1",
            name: "Test Patient",
            age: 50,
            unitId: "A1",
            dryWeight: 70,
            scheduledDate: new Date().toISOString().split("T")[0],
        });
    });

    it("creates a new session", async () => {
        const response = await request(app)
            .post("/api/sessions")
            .send({
                patientId: "1",
                startTime: new Date().toISOString(),
                preWeight: 73,
                machineId: "M-101",
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.status).toBe("in_progress");
    });

});