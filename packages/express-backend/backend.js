// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

function generateId() {
  return Math.floor(Math.random() * 1000000);
}

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.get("/users", (req, res) => {
  res.send(users);
});

// step 4

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

// step 5

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

// step 6

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};


// step 7

const removeUserById = (id) => {
  const i = users["users_list"].findIndex((u) => u["id"] === id);
  if (i === -1) return false;
  users["users_list"].splice(i, 1);
  return true;
};

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;            // same pattern as GET /users/:id
  const removed = removeUserById(id);  // or inline this logic if you prefer
  if (!removed) {
    return res.status(404).send("Resource not found."); // consistent with Step 5
  }
  // 204 No Content is a common success code for a successful DELETE
  return res.status(204).send();
});

// find users by specific name and job

const findUsersByNameAndJob = (name, job) =>
  users["users_list"].filter(
    (u) => u["name"] === name && u["job"] === job
  );

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job  = req.query.job;

  if (name !== undefined && job !== undefined) {
    let result = findUsersByNameAndJob(name, job);
    result = { users_list: result };
    return res.send(result);
  }

  // name only filter
  if (name !== undefined) {
    let result = users["users_list"].filter((u) => u["name"] === name);
    result = { users_list: result };
    return res.send(result);
  }

  return res.send(users);
});

app.use(cors());

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateId();
  users_list.push(userToAdd);
  return res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const idx = users_list.findIndex(u => String(u.id) === String(id));

  if (idx === -1) {
    return res.status(404).send({ error: "User not found" });
  }

  users_list.splice(idx, 1);
  return res.status(204).send();
});