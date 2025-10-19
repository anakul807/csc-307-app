// backend.js
import express from "express";
import cors from "cors";
import services from "./services/user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET /users (optionally filter by name and/or job)
// - /users
// - /users?name=Alice
// - /users?job=Engineer
// - /users?name=Alice&job=Engineer
app.get("/users", (req, res) => {
  const { name, job } = req.query;
  services
    .getUsers(name, job)
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: "Failed to fetch users" });
    });
});

// GET /users/:id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  services
    .findUserById(id)
    .then((user) => {
      if (!user) return res.status(404).send({ error: "User not found" });
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: "Failed to fetch user" });
    });
});

// POST /users
app.post("/users", (req, res) => {
  const user = req.body;
  services
    .addUser(user)
    .then((created) => res.status(201).send(created))
    .catch((err) => {
      console.error(err);
      res.status(400).send({ error: "Failed to create user" });
    });
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  services
    .deleteUserById(id)
    .then((deleted) => {
      if (!deleted) return res.status(404).send({ error: "User not found" });
      return res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ error: "Failed to delete user" });
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
