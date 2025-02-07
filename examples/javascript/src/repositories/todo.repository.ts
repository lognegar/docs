import Todo from "../models/todo.model";

export class TodoRepository {
    async findAll() {
        return await Todo.findAll();
    }

    async findById(id: string) {
        return await Todo.findByPk(id);
    }

    async create(todoData: { title: string }) {
        return await Todo.create(todoData);
    }

    async update(
        id: string,
        updatedTodo: Partial<{ title: string; completed: boolean }>
    ) {
        const todo = await Todo.findByPk(id);
        if (!todo) return null;
        return await todo.update(updatedTodo);
    }

    async delete(id: string) {
        const todo = await Todo.findByPk(id);
        if (!todo) return false;
        await todo.destroy();
        return true;
    }
}
