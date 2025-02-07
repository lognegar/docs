import { DataTypes, Model } from "sequelize";
import sequelize from "../configs/orm";

export class Todo extends Model {
    public id!: string;
    public title!: string;
    public completed!: boolean;
}

Todo.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "todos",
        timestamps: true,
    }
);

export default Todo;
