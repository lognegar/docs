import { Sequelize } from "sequelize";
import env from "./env";

const sequelize = new Sequelize(
    env.DB_NAME as string,
    env.DB_USER as string,
    env.DB_PASSWORD as string,
    {
        host: env.DB_HOST,
        dialect: "postgres",
        logging: false,
    }
);

sequelize.sync();

export default sequelize;
