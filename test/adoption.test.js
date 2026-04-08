import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Adoption Router Tests", () => {

    // GET ALL
    it("GET /api/adoptions should return all adoptions", async () => {
        const response = await requester.get("/api/adoptions");

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("object");
    });

    // GET BY ID (success or fail)
    it("GET /api/adoptions/:aid should return one adoption or error", async () => {
        const fakeId = "64b000000000000000000000"; // fake mongo id

        const response = await requester.get(`/api/adoptions/${fakeId}`);
        
        expect(response.status).to.be.oneOf([200, 404]);
    });

    // CREATE ADOPTION (FAIL CASE)
    it("POST /api/adoptions/:uid/:pid should fail with invalid ids", async () => {
        const response = await requester.post("/api/adoptions/invalidUser/invalidPet");

        expect(response.status).to.be.oneOf([400, 404, 500]);
    });

});