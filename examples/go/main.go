package main

import (
	"context"
	"goexample/middlewares"
	"goexample/routes"
	"goexample/telemetry"
	"log"
	"net"
	"net/http"
)

func main() {
	router := http.NewServeMux()

	routes.LoadRoutes(router)
	stack := middlewares.CreateStack(middlewares.Logging)

	ctx := context.Background()

	cleanupTracer := telemetry.InitTracer(ctx)
	cleanupMeter := telemetry.InitMeter(ctx)
	cleanupLogger := telemetry.InitLogger(ctx)

	defer func() {
		cleanupTracer()
		cleanupMeter()
		cleanupLogger()
	}()

	port := ":3090"
	server := http.Server{
		Addr: port,
		BaseContext: func(listener net.Listener) context.Context {
			return ctx
		},
		Handler: stack(router),
	}

	log.Printf("Server listening on http://localhost%s \n", port)

	server.ListenAndServe()

}
