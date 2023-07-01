import type { Request, Response } from "express";
import { computeScore } from "./computeScore";
import { Point } from "./types";

export function computeScoreController(req: Request, res: Response) {
	const points = req.body;

	if (! isValidPointsArray(points)) {
		return res
			.status(400)
			.json({
				error: 400,
				message: "Invalid body format. Should be : [0, 1, 1, 0, 1, ...]"
			});
	}

	const score = computeScore(points);
	
	res.json(score);
}


function isValidPointsArray(points: unknown): points is Array<Point> {
  if (! Array.isArray(points)) { return false; }

  return ! points.some(isNotZeroOrOne);

  function isNotZeroOrOne(point: any) {
    return point !== 0 && point !== 1;
  }
}