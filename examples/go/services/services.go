package services

import (
	"context"
	"goexample/telemetry"
	"math/rand"
	"time"
)

func GenerateRandomNumber(min, max int) int {
	return rand.Intn(max-min+1) + min
}

func ConnectToServiceA(ctx context.Context) {
	_, span := telemetry.GetTracer().Start(ctx, "ConnectToServiceA")
	defer span.End()

	time.Sleep(time.Duration(GenerateRandomNumber(30, 100)) * time.Millisecond)
}

func ConnectToServiceB(ctx context.Context) {
	_, span := telemetry.GetTracer().Start(ctx, "ConnectToServiceB")
	defer span.End()

	time.Sleep(time.Duration(GenerateRandomNumber(70, 150)) * time.Millisecond)
}

func ConnectToServiceC(ctx context.Context) {
	_, span := telemetry.GetTracer().Start(ctx, "ConnectToServiceC")
	defer span.End()

	time.Sleep(time.Duration(GenerateRandomNumber(100, 200)) * time.Millisecond)
}

func ConnectToServices(ctx context.Context) {
	// Connect to service A to simulate a network call
	ConnectToServiceA(ctx)

	// Connect to service B to simulate a network call
	ConnectToServiceB(ctx)

	// Connect to service C to simulate a network call
	ConnectToServiceC(ctx)
}
