import { logEvents } from "./logEvents.js";

const errorHandler = (error, req, res, next) => {
    logEvents(`${error.name}: ${error.message}`, "errLog.txt");
    console.error(error.stack)
    res.status(500).send(error.message);
}

export default errorHandler;