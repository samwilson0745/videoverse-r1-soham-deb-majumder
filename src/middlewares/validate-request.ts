import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Response as APIResponse } from "../types/response";

export function validateRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const response: APIResponse = {
            status: 400,
            message: "Validation failed",
            errors: errors.array(),
        };
        return res.status(400).json(response);
    }
    next();
}