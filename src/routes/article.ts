import { Router, Request, Response } from "express";
import { query } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { Response as APIResponse } from "../types/response";
import { getArticles } from "../service/article";

const router: Router = Router();

router.get(
    "/articles",
    [
        query("after").optional().isISO8601().withMessage("After must be a valid ISO8601 date"),
        query("before").optional().isISO8601().withMessage("Before must be a valid ISO8601 date"),
        query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
        query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { after, before, page = 1, limit = 10 } = req.query;

        try {
            const responseData = await getArticles({
                after: after as string | undefined,
                before: before as string | undefined,
                page: Number(page),
                limit: Number(limit),
            });

            const response: APIResponse = {
                status: 200,
                message: "Articles Fetched Successfully",
                data: responseData
            }
            res.status(response.status).json(response);
        } catch (err) {
            console.error("Error querying articles:", err);
            const errorResponse: APIResponse = {
                status: 500,
                message: "Internal Server Error"
            }
            res.status(errorResponse.status).json(errorResponse);
        }
    }
);

export default router;
