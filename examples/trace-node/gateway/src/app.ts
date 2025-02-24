import express from "express";

import { context, propagation, trace } from "@opentelemetry/api";
import bodyParser from "body-parser";
import { apiService } from "./axios";
import OTEL_SDK from "./otel";
import requestLogger from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/errors.middleware";
import { isAxiosError } from "axios";

const app = express();

app.use(bodyParser.json());
app.use(requestLogger);
app.use(errorHandler);

const tracer = trace.getTracer("gateway");

app.post("/auth/register", async (req, res) => {
  return tracer.startActiveSpan("gateway-register", async (span) => {
    try {
      const headers = {};
      propagation.inject(context.active(), headers);
      const response = await apiService.post("/auth/register", req.body, {
        headers,
      });

      res.status(response?.status ?? 500).json(response?.data);
    } catch (error) {
      if (isAxiosError(error)) {
        res
          .status(error.response?.status ?? 500)
          .json(error.response?.data ?? { message: "internal server error" });
        return;
      }

      res.status(500).json({ message: "internal server error" });
    } finally {
      span.end();
    }
  });
});

app.post("/auth/login", async (req, res) => {
  return tracer.startActiveSpan("gateway-login", async (span) => {
    try {
      const headers = {};
      propagation.inject(context.active(), headers);
      const response = await apiService.post("/auth/login", req.body, {
        headers,
      });

      res.status(response?.status ?? 500).json(response?.data);
    } catch (error) {
      if (isAxiosError(error)) {
        res
          .status(error.response?.status ?? 500)
          .json(error.response?.data ?? { message: "internal server error" });
        return;
      }

      res.status(500).json({ message: "internal server error" });
    } finally {
      span.end();
    }
  });
});

app.listen(process.env.PORT ?? "3063", () => {
  OTEL_SDK.start();
});
