import express from "express";
import OTEL_SDK from "./otel";
import todoRouter from "./routes/todo.route";
import bodyParser from "body-parser";
import requestLogger from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/errors.middleware";

const app = express();
const port = 3090;

app.use(bodyParser.json());
app.use(requestLogger);
app.use("/todos", todoRouter);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World" });
});

app.use(errorHandler);

app.listen(port, () => {
    // Start OTEL SDK
    OTEL_SDK.start();

    console.log(`App listening on http://localhost:${port}`);
});
