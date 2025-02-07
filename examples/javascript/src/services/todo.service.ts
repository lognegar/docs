import { TodoRepository } from "../repositories/todo.repository";

export class TodoService {
    private repository = new TodoRepository();

    async getAllTodos() {
        return await this.repository.findAll();
    }

    async getTodoById(id: string) {
        return await this.repository.findById(id);
    }

    async createTodo(title: string) {
        return await this.repository.create({ title });
    }

    async updateTodo(
        id: string,
        updatedData: Partial<{ title: string; completed: boolean }>
    ) {
        return await this.repository.update(id, updatedData);
    }

    async deleteTodo(id: string) {
        return await this.repository.delete(id);
    }
}
