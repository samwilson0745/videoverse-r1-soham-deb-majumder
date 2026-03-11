import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { fileFetchingAndParsing } from "../service/file-ingestion";
import { validateRequest } from "../middlewares/validate-request";
import { Response as APIResponse } from "../types/response";
const router: Router = Router();


router.post(
    "/ingest",
    body("url").notEmpty().withMessage("Url is required"),
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const { url } = req.body;
            await fileFetchingAndParsing(url)
            const response: APIResponse = {
                status: 200,
                message: "Ingestion Completed Successfully",
                data: {}
            }
            res.status(response.status).json(response)
        } catch (err) {
            console.error("error while ingesting", err)
            const response: APIResponse = {
                status: 500,
                message: "Internal Server Error",
            }
            res.status(response.status).send(response)
        }

    }

)

export default router;
