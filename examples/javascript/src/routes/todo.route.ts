import { Router } from "express";
import TodoController from "../controllers/todo.controller";

const router = Router();

const todoController = new TodoController();

router
    .route("/")
    .get(todoController.getAllTodos)
    .post(todoController.createTodo);

router
    .route("/:id")
    .get(todoController.getTodoById)
    .delete(todoController.deleteTodo)
    .patch(todoController.updateTodo);

export default router;
