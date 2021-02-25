var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql");

var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootroot",
  database: "moviePlannerDB",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

app.get("/", function (req, res) {
  connection.query("SELECT * FROM movies", function (err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { movies: data });
  });
});

app.post("/api/movies", function (req, res) {
  connection.query(
    "INSERT INTO movies (movie) VALUES (?)",
    [req.body.movie],
    function (err, result) {
      if (err) {
        return res.status(500).end();
      }

      res.json({ id: result.insertId });
      console.log({ id: result.insertId });
    }
  );
});

app.put("/api/movies/:id", function (req, res) {
  connection.query("UPDATE movies SET movie = ? WHERE id = ?", [
    req.body.movie,
    req.params.id,
  ]),
    function (err, result) {
      if (err) {
        return res.status(500).end();
      } else if (result.changedRows === 0) {
        return res.status(404).end();
      }
      res.status(200).end();
    };
});

// app.delete("/api/movies/:id");

app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
