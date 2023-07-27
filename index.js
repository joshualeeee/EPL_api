const express = require("express");
const connection = require("./connection");
const standingsRouter = require("./routes/standings");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/standings', standingsRouter);

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

module.exports = app;