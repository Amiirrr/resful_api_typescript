import { NextFunction, Response, Request } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export const errorMiddleware = async (error: Error, request: Request, res: Response, next: NextFunction) => {

    //Error syarat ZOD kosong
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: `Validation Error : ${JSON.stringify(error)}`
        });
        //Error syarat
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message
        })
        //Error
    } else {
        res.status(500).json({
            errors: error.message
        })
    }
}