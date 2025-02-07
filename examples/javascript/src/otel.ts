import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { Resource } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import env from "./configs/env";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics/build/src";

const OTEL_URL = env.OTEL_URL ?? "";

const resource = new Resource({
    [ATTR_SERVICE_NAME]: "Lognegar",
});

const logExporter = new OTLPLogExporter({
    url: OTEL_URL + "/logs",
});

const traceExporter = new OTLPTraceExporter({
    url: OTEL_URL + "/traces",
});

const metricExporter = new OTLPMetricExporter({
    url: OTEL_URL + "/metrics",
});

const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10_000, // ms
});

const OTEL_SDK = new NodeSDK({
    resource,
    metricReader,
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
});

// Graceful shutdown for OTEL
process.on("SIGTERM", () => {
    OTEL_SDK.shutdown().then(() => console.log("Observation terminated"));
});

export default OTEL_SDK;
