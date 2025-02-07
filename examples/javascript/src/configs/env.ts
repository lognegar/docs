import dotenv from "dotenv";

const isProduction = process.env.NODE_ENV === "production";

const env = dotenv.config({
    path: isProduction ? "src/.env.production" : "src/.env",
}).parsed;

export default env;
