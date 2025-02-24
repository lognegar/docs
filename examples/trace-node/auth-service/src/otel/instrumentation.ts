import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

const OTEL_URL = process.env.OTEL_BASE_URL ?? '';

const resource = new Resource({
  [ATTR_SERVICE_NAME]: 'auth-service',
});

const traceExporter = new OTLPTraceExporter({
  url: OTEL_URL + '/traces',
});

const OTEL_SDK = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [
    new PgInstrumentation({ enhancedDatabaseReporting: true }),
  ],
});

export default OTEL_SDK;
