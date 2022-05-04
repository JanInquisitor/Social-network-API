const {connect, connection} = require('mongoose');
const dotenv = require("dotenv");

dotenv.config({path: "./config.env"});

const connectionString = process.env.DATABASE;

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;