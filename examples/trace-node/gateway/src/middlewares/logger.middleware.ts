import { Request, Response, NextFunction } from "express";
import OTEL_LOGGER from "../otel-logger";
import { SeverityNumber } from "@opentelemetry/api-logs/build/src";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("logger");

const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  tracer.startActiveSpan("gateway-logger", async (span) => {
    const { method, url, body } = req;

    OTEL_LOGGER.emit({
      severityText: "INFO",
      severityNumber: SeverityNumber.INFO,
      body: `${method.toUpperCase()} - ${url}`,
      attributes: { method, url, body },
    });

    next();

    span.end();
  });
};

export default requestLogger;
