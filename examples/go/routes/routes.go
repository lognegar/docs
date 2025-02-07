package routes

import (
	"goexample/controller"
	"net/http"
)

func LoadRoutes(router *http.ServeMux) {
	router.HandleFunc("POST /todos", controller.CreateTodo)
	router.HandleFunc("GET /todos", controller.ListTodos)
	router.HandleFunc("PUT /todos/{id}", controller.UpdateTodo)
	router.HandleFunc("GET /todos/{id}", controller.GetTodoByID)
	router.HandleFunc("DELETE /todos/{id}", controller.DeleteTodo)
}
