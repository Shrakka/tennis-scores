import { expect } from "chai";
import { computeScore } from "./computeScore";
import { Point, Score } from "./types";

const INITIAL_SCORE: Score = {
  sets: [[0, 0]],
  currentGame: [0, 0]
};

describe("computeScore", () => {
  it("should return the inital score when no points are won", async () => {
    const points: Point[] = [];

    const score = computeScore(points);

    expect(score).to.deep.equal(INITIAL_SCORE);
  });
});
