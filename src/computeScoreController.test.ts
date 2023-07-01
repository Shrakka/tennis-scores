import { expect } from "chai";
import request from "supertest";
import { app } from "./app";
import type { Point } from "./types";

describe("POST /api/scores", () => {
  it("should responds with a 200 status and the initial score given an empty array", async () => {
    const body: Point[] = [];

    const response = await request(app)
      .post("/api/scores")
      .send(body);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ sets: [[0, 0]], currentGame: [0, 0] });
  });

  it("should responds with a 400 when no array is provided", async () => {
    const body = {} as Point[];

    const response = await request(app)
      .post("/api/scores")
      .send(body);

    expect(response.status).to.equal(400);
  });

  it("should responds with a 400 when the provided array contains something else than 0 and 1", async () => {
    const body = [0, 1, 2] as Point[];

    const response = await request(app)
      .post("/api/scores")
      .send(body);

    expect(response.status).to.equal(400);
  });
});