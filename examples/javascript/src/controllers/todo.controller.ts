import { NextFunction, Request, Response } from "express";
import { TodoService } from "../services/todo.service";
import { AppError } from "../middlewares/errors.middleware";

const service = new TodoService();

class TodoController {
    async getAllTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const todos = await service.getAllTodos();
            res.json(todos);
        } catch (error) {
            next(error);
        }
    }

    async getTodoById(req: Request, res: Response, next: NextFunction) {
        try {
            const todo = await service.getTodoById(req.params.id);

            if (!todo) {
                throw new AppError("Todo not found", 404);
            }

            res.json(todo);
        } catch (error) {
            next(error);
        }
    }

    async createTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const { title } = req.body;

            if (!title) {
                throw new AppError("Title is required", 400);
            }

            const newTodo = await service.createTodo(title);
            res.status(201).json(newTodo);
        } catch (error) {
            next(error);
        }
    }

    async updateTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedTodo = await service.updateTodo(
                req.params.id,
                req.body
            );

            if (!updatedTodo) {
                throw new AppError("Todo not found", 404);
            }

            res.json(updatedTodo);
        } catch (error) {
            next(error);
        }
    }

    async deleteTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const success = await service.deleteTodo(req.params.id);

            if (!success) {
                throw new AppError("Todo not found", 404);
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default TodoController;
