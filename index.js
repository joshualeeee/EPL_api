const express = require("express");
const cors = require("cors");
const connection = require("./connection");
const standingsRouter = require("./routes/standings");

const app = express();

const corsOptions = {
    origin: "http://localhost:1234",
  };

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/standings', standingsRouter);

const server = app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

function closeServer(done) {
  server.close(() => {
    connection.end((err) => {
      if (err) console.error("Error closing MySQL connection:", err);
      else console.log("MySQL connection closed.");
      done();
    });
    });
}

module.exports = {app, closeServer};