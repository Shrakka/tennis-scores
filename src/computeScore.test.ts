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

  it("should increase the first player current game score", async () => {
    const points: Point[] = [0];

    const score = computeScore(points);

    expect(score).to.deep.equal({ ...INITIAL_SCORE, currentGame: [15, 0] });
  });

  it("should increase the second player current game score", async () => {
    const points: Point[] = [1];

    const score = computeScore(points);

    expect(score).to.deep.equal({ ...INITIAL_SCORE, currentGame: [0, 15] });
  });

  it("should increase the first player current set score", async () => {
    const points: Point[] = [0, 0, 0, 0];

    const score = computeScore(points);

    expect(score).to.deep.equal({ sets: [[1, 0]], currentGame: [0, 0] });
  });

  it("should increase the second player current set score", async () => {
    const points: Point[] = [1, 1, 1, 1];

    const score = computeScore(points);

    expect(score).to.deep.equal({ sets: [[0, 1]], currentGame: [0, 0] });
  });

  it("should set first player score to AV when both players have 40", async () => {
    const points: Point[] = [0, 0, 0, 1, 1, 1, 0];

    const score = computeScore(points);

    expect(score).to.deep.equal({ ...INITIAL_SCORE, currentGame: ["AV", 40] });
  });

  it("should set second player score to AV when both players have 40", async () => {
    const points: Point[] = [1, 1, 1, 0, 0, 0, 1];

    const score = computeScore(points);

    expect(score).to.deep.equal({ ...INITIAL_SCORE, currentGame: [40, "AV"] });
  });

  it("should initiate a new set when the first player wins 6 games", async () => {
    const points: Point[] = Array(4 * 6).fill(0); // 4 * 6 = 24 points

    const score = computeScore(points);

    expect(score).to.deep.equal({ sets: [[6, 0], [0, 0]], currentGame: [0, 0] });
  });

  it("should initiate a new set when the second player wins 6 games", async () => {
    const points: Point[] = Array(4 * 6).fill(1); // 4 * 6 = 24 points

    const score = computeScore(points);

    expect(score).to.deep.equal({ sets: [[0, 6], [0, 0]], currentGame: [0, 0] });
  });

  describe("tiebreaks", () => {
    const DECISIVE_GAME_POINTS: Point[] = [
      ...Array(4 * 5).fill(0), // first player wins 5 games
      ...Array(4 * 5).fill(1), // second player wins 5 games
      ...Array(4 * 1).fill(0), // first player wins 1 game
      ...Array(4 * 1).fill(1)  // second player wins 1 game
    ];

    it("should initiate a tiebreak when both players wins 6 games", async () => {
      const score = computeScore(DECISIVE_GAME_POINTS);
  
      expect(score).to.deep.equal({ sets: [[6, 6]], currentGame: [0, 0] });
    });
  
    it("should increase the score of the tiebreak when first player wins a point", async () => {
      const points: Point[] = [...DECISIVE_GAME_POINTS, 0];
  
      const score = computeScore(points);
  
      expect(score).to.deep.equal({ sets: [[6, 6]], currentGame: [1, 0] });
    });

    it("should increase the score of the tiebreak when second player wins a point", async () => {
      const points: Point[] = [...DECISIVE_GAME_POINTS, 1];
  
      const score = computeScore(points);
  
      expect(score).to.deep.equal({ sets: [[6, 6]], currentGame: [0, 1] });
    });

    it("should initiate a new set when the first player wins the tiebreak", async () => {
      const points: Point[] = [
        ...DECISIVE_GAME_POINTS,
        ...Array(7).fill(0)
      ];

      const score = computeScore(points);
  
      expect(score).to.deep.equal({ sets: [[7, 6], [0, 0]], currentGame: [0, 0] });
    });

    it("should initiate a new set when the second player wins the tiebreak", async () => {
      const points: Point[] = [
        ...DECISIVE_GAME_POINTS,
        ...Array(7).fill(1)
      ];

      const score = computeScore(points);
  
      expect(score).to.deep.equal({ sets: [[6, 7], [0, 0]], currentGame: [0, 0] });
    });

    it("should continue the tiebreak when the two players scores are equal and above 6", async () => {
      const points: Point[] = [
        ...DECISIVE_GAME_POINTS,
        ...Array(6).fill(0), // first player wins 6 points during timebreak
        ...Array(6).fill(1), // second player wins 6 points during timebreak
        0, // first player wins another point
      ];

      const score = computeScore(points);
  
      expect(score).to.deep.equal({ sets: [[6, 6]], currentGame: [7, 6] });
    });

    it("should continue the tiebreak when the led player catches up", async () => {
      const points: Point[] = [
        ...DECISIVE_GAME_POINTS,
        ...Array(6).fill(0), // first player wins 6 points during timebreak
        ...Array(6).fill(1), // second player wins 6 points during timebreak
        0, // first player wins another point
        1, // then second player catches up
      ];

      const score = computeScore(points);
  
      expect(score).to.deep.equal({ sets: [[6, 6]], currentGame: [7, 7] });
    });

    it("should finish the tiebreak when the leading player wins an extra point", async () => {
      const points: Point[] = [
        ...DECISIVE_GAME_POINTS,
        ...Array(6).fill(0), // first player wins 6 points during timebreak
        ...Array(6).fill(1), // second player wins 6 points during timebreak
        0, // first player wins another point
        1, // then second player catches up
        1, // wins an extra point
        1 // and finishes the game !
      ];

      const score = computeScore(points);
  
      expect(score).to.deep.equal({ sets: [[6, 7], [0, 0]], currentGame: [0, 0] });
    });
  });

  describe("end of match", () => {
    const SET_WON_BY_FIRST_PLAYER = Array(6 * 4).fill(0);
    const SET_WON_BY_SECOND_PLAYER = Array(6 * 4).fill(1);

    it("should return the end result when the first player wins 3 sets in a row", async () => {
      const points: Point[] = [
        ...SET_WON_BY_FIRST_PLAYER,
        ...SET_WON_BY_FIRST_PLAYER,
        ...SET_WON_BY_FIRST_PLAYER,
      ];

      const score = computeScore(points);
  
      expect(score).to.deep.include({ sets: [[6, 0], [6, 0], [6, 0]], winner: 0 });
    });

    it("should not end the game when both players have won 2 games each", async () => {
      const points: Point[] = [
        ...SET_WON_BY_FIRST_PLAYER,
        ...SET_WON_BY_FIRST_PLAYER,
        ...SET_WON_BY_SECOND_PLAYER,
        ...SET_WON_BY_SECOND_PLAYER
      ];

      const score = computeScore(points);
  
      expect(score).to.deep.include({ sets: [[6, 0], [6, 0], [0, 6], [0, 6], [0, 0]] });
    });

    it("should end the game when first player won 3 games out of 5", async () => {
      const points: Point[] = [
        ...SET_WON_BY_FIRST_PLAYER,
        ...SET_WON_BY_FIRST_PLAYER,
        ...SET_WON_BY_SECOND_PLAYER,
        ...SET_WON_BY_SECOND_PLAYER,
        ...SET_WON_BY_SECOND_PLAYER,
      ];

      const score = computeScore(points);
  
      expect(score).to.deep.include({ sets: [[6, 0], [6, 0], [0, 6], [0, 6], [0, 6]], winner: 1 });
    });

    it("should end the game even though there are more points than what is theoretically possible", async () => {
      const points: Point[] = Array(1000).fill(0); // First player wins 1000 points

      const score = computeScore(points);
  
      expect(score).to.deep.include({ sets: [[6, 0], [6, 0], [6, 0]], winner: 0 });
    });
  });
});
