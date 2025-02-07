package middlewares

import (
	"goexample/telemetry"
	"log"
	"net/http"
	"time"

	otelLog "go.opentelemetry.io/otel/log"
)

type wrappedWriter struct {
	http.ResponseWriter
	statusCode int
}

func (w *wrappedWriter) WriteHeader(statusCode int) {
	w.ResponseWriter.WriteHeader(statusCode)
	w.statusCode = statusCode
}

func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		traceName := r.Method + " - " + r.URL.Path
		ctx, span := telemetry.GetTracer().Start(r.Context(), traceName)
		defer span.End()

		wrapped := &wrappedWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		next.ServeHTTP(wrapped, r.WithContext(ctx))

		var record otelLog.Record
		record.SetTimestamp(time.Now())
		record.SetBody(otelLog.StringValue(traceName))
		record.SetSeverity(otelLog.SeverityInfo)
		record.AddAttributes(
			otelLog.String("url", r.URL.Path),
			otelLog.String("method", r.Method),
			otelLog.Int("status", wrapped.statusCode),
			otelLog.String("host", r.Host),
			otelLog.String("user-agent", r.UserAgent()),
			otelLog.String("remote-addr", r.RemoteAddr),
			otelLog.String("referer", r.Referer()),
		)

		telemetry.GetLogger().Emit(ctx, record)
		log.Println(wrapped.statusCode, r.Method, r.URL.Path, time.Since(start))
	})
}
