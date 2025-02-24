import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { Resource } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import {
  CompositePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core/build/src";
import { propagation } from "@opentelemetry/api";

const OTEL_URL = process.env.OTEL_BASE_URL ?? "http://localhost:4318/v1";

const resource = new Resource({
  [ATTR_SERVICE_NAME]: "gateway",
});

const logExporter = new OTLPLogExporter({
  url: OTEL_URL + "/logs",
});

const traceExporter = new OTLPTraceExporter({
  url: OTEL_URL + "/traces",
});

const OTEL_SDK = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
  logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
});

// ✅ Register W3C Propagator for Context Propagation
propagation.setGlobalPropagator(
  new CompositePropagator({
    propagators: [new W3CTraceContextPropagator()],
  })
);

// Graceful shutdown for OTEL
process.on("SIGTERM", () => {
  OTEL_SDK.shutdown().then(() => console.log("Observation terminated"));
});

export default OTEL_SDK;
