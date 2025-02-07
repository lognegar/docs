package telemetry

import (
	"context"
	"log"
	"os"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploghttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	otelLog "go.opentelemetry.io/otel/log"
	"go.opentelemetry.io/otel/log/global"
	"go.opentelemetry.io/otel/propagation"
	sdklog "go.opentelemetry.io/otel/sdk/log"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	"go.opentelemetry.io/otel/trace"
)

const (
	ServiceName         = "todo-app"
	defaultOtelEndpoint = "http://localhost:4318/v1"
)

var tracer trace.Tracer

var (
	logger  = global.Logger(ServiceName)
	BaseURL = getOtelBaseURL()
)

func getOtelBaseURL() string {
	url := os.Getenv("OTEL_BASE_URL")
	if url == "" {
		return defaultOtelEndpoint
	}
	return url
}

func newResource() *resource.Resource {
	r, err := resource.Merge(
		resource.Default(),
		resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName(ServiceName),
			semconv.ServiceVersion("1.0.0"),
		),
	)

	if err != nil {
		log.Fatalf("failed to create resource: %v", err)
	}

	return r
}

func newTraceProvider(exp sdktrace.SpanExporter) *sdktrace.TracerProvider {
	r := newResource()

	return sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exp),
		sdktrace.WithResource(r),
	)
}

func newTraceExporter(ctx context.Context) (sdktrace.SpanExporter, error) {
	client := otlptracehttp.NewClient(
		otlptracehttp.WithInsecure(),
		otlptracehttp.WithEndpointURL(BaseURL+"/traces"),
	)

	return otlptrace.New(ctx, client)
}

func InitTracer(ctx context.Context) func() {
	exporter, err := newTraceExporter(ctx)

	if err != nil {
		log.Fatalf("failed to trace exporter: %v", err)
	}

	tp := newTraceProvider(exporter)

	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{}),
	)

	tracer = tp.Tracer(ServiceName)

	return func() {
		if err := tp.Shutdown(ctx); err != nil {
			log.Println(err)
		}
	}
}

func newLogExporter(ctx context.Context) (sdklog.Exporter, error) {
	return otlploghttp.New(ctx,
		otlploghttp.WithInsecure(),
		otlploghttp.WithEndpointURL(BaseURL+"/logs"),
	)
}

func newLogProvider(exp sdklog.Exporter) *sdklog.LoggerProvider {
	res := newResource()
	processor := sdklog.NewBatchProcessor(exp)

	provider := sdklog.NewLoggerProvider(
		sdklog.WithResource(res),
		sdklog.WithProcessor(processor),
	)

	return provider
}

func InitLogger(ctx context.Context) func() {
	exp, err := newLogExporter(ctx)
	if err != nil {
		log.Fatalf("failed to create log exporter: %v", err)
	}

	lp := newLogProvider(exp)
	global.SetLoggerProvider(lp)

	return func() {
		if err := lp.Shutdown(ctx); err != nil {
			log.Println(err)
		}
	}
}

func newMeterProvider(exp sdkmetric.Exporter) (*sdkmetric.MeterProvider, error) {
	res := newResource()

	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithResource(res),
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(exp,
			// Default is 1m. Set to 10s for demonstrative purposes.
			sdkmetric.WithInterval(10*time.Second))),
	)

	return meterProvider, nil
}

func newMeterExporter(ctx context.Context) (sdkmetric.Exporter, error) {
	return otlpmetrichttp.New(ctx,
		otlpmetrichttp.WithInsecure(),
		otlpmetrichttp.WithEndpointURL(BaseURL+"/metrics"))
}

func InitMeter(ctx context.Context) func() {
	exp, err := newMeterExporter(ctx)
	if err != nil {
		log.Fatalf("failed to create metric exporter: %v", err)
	}

	mp, err := newMeterProvider(exp)
	if err != nil {
		log.Fatalf("failed to create meter provider: %v", err)
	}

	otel.SetMeterProvider(mp)

	return func() {
		if err := mp.Shutdown(ctx); err != nil {
			log.Println(err)
		}
	}
}

func GetTracer() trace.Tracer {
	return tracer
}

func GetLogger() otelLog.Logger {
	return logger
}
