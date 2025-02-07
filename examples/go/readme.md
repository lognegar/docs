# Start Guide

## Prerequisites

Before running this example, ensure you have the following installed:

-   Go (1.22 or higher)
-   Docker

## In order to run the application in development mode use the commands below:

Note: you should edit .env file to connect app to your postgres database

```bash

# use air or the run command
go run main.go

# Install Air
go install github.com/air-verse/air@latest

# use air to enable live reload
air

```

## In order to run the application with all dependencies open telemetry collector you can use the docker compose file

Note: you must modify otel-collector-config.yaml file and use your api key from lognegar.ir

```bash

docker compose up -d --build

```

## Examples:

Get Todos List:

```bash
curl -X GET http://localhost:3090/todos -H "Content-Type: application/json"
```

Get Todos By ID:

```bash
curl -X GET http://localhost:3090/todos/{id} -H "Content-Type: application/json"
```

Create Todo:

```bash
curl -X POST http://localhost:3090/todos \
-H "Content-Type: application/json" \
-d '{
    "title": "New Task"
}'

```

Update Todo:

```bash
curl -X PATCH http://localhost:3000/todos/{id} \
-H "Content-Type: application/json" \
-d '{
    "title": "Updated Todo Title"
}'

```

Delete Todo:

```bash
curl -X DELETE http://localhost:3000/todos/{id} -H "Content-Type: application/json"

```
