import { logs } from "@opentelemetry/api-logs";

const OTEL_LOGGER = logs.getLogger("default", "1.0.0", {
  includeTraceContext: true,
});

export default OTEL_LOGGER;
