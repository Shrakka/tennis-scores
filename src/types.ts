export type FirstPlayerWinsPointCode = 0;
export type SecondPlayerWinsPointCode = 1;

export type Point = FirstPlayerWinsPointCode | SecondPlayerWinsPointCode;

export type SetPoint = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type GamePoint = ClassicGamePoint | DecisiveGamePoint;
export type ClassicGamePoint = 0 | 15 | 30 | 40 | "AV";
export type DecisiveGamePoint = number;

export interface Score {
  sets: Array<[SetPoint, SetPoint]>,
  currentGame: [GamePoint, GamePoint],
  winner?: FirstPlayerWinsPointCode | SecondPlayerWinsPointCode
}
