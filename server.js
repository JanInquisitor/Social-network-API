const db = require("./config/connection");
const dotenv = require("dotenv");
const app = require("./app");

process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("Uncaught exception! Shutting down.");
    process.exit(1);
});

dotenv.config({path: "./config.env"});

const PORT = 3002;
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}!`);
    });
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandled rejection! Shutting down.");
    server.close(() => {
        process.exit(1);
    });
});

