package controller

import (
	"encoding/json"
	"goexample/services"
	"goexample/telemetry"
	"net/http"
	"time"

	"github.com/google/uuid"
)

var todos = make(map[string]Todo)

type Todo struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func CreateTodo(w http.ResponseWriter, r *http.Request) {
	_, span := telemetry.GetTracer().Start(r.Context(), "CreateTodo")
	defer span.End()

	var todo Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	todo.ID = uuid.New().String()
	todo.CreatedAt = time.Now()
	todo.UpdatedAt = time.Now()

	todos[todo.ID] = todo

	// Simulate some work
	services.ConnectToServices(r.Context())

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(todo)
}

func ListTodos(w http.ResponseWriter, r *http.Request) {
	_, span := telemetry.GetTracer().Start(r.Context(), "ListTodo")
	defer span.End()

	todoList := make([]Todo, 0, len(todos))
	for _, todo := range todos {
		todoList = append(todoList, todo)
	}

	// Simulate some work
	services.ConnectToServices(r.Context())

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todoList)
}

func GetTodoByID(w http.ResponseWriter, r *http.Request) {
	_, span := telemetry.GetTracer().Start(r.Context(), "GetTodoByID")
	defer span.End()

	id := r.PathValue("id")
	todo, exists := todos[id]
	if !exists {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	// Simulate some work
	services.ConnectToServices(r.Context())

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

func UpdateTodo(w http.ResponseWriter, r *http.Request) {
	_, span := telemetry.GetTracer().Start(r.Context(), "UpdateTodo")
	defer span.End()

	id := r.PathValue("id")
	_, exists := todos[id]
	if !exists {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	var todo Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	todo.ID = id
	todo.UpdatedAt = time.Now()
	todos[id] = todo

	// Simulate some work
	services.ConnectToServices(r.Context())

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

func DeleteTodo(w http.ResponseWriter, r *http.Request) {
	_, span := telemetry.GetTracer().Start(r.Context(), "DeleteTodo")
	defer span.End()

	id := r.PathValue("id")
	_, exists := todos[id]
	if !exists {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	// Simulate some work
	services.ConnectToServices(r.Context())

	delete(todos, id)
	w.WriteHeader(http.StatusNoContent)
}
