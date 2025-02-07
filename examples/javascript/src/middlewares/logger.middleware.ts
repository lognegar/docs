import { Request, Response, NextFunction } from "express";
import OTEL_LOGGER from "../otel-logger";
import { SeverityNumber } from "@opentelemetry/api-logs/build/src";

const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { method, url, body } = req;

    OTEL_LOGGER.emit({
        severityText: "INFO",
        severityNumber: SeverityNumber.INFO,
        body: `${method.toUpperCase()} - ${url}`,
        attributes: { method, url, body },
    });

    next();
};

export default requestLogger;
