// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

const API_BASE = "http://localhost:8000";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    return fetch(`${API_BASE}/users`);
  }

  function postUser(person) {
    return fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
  }

  function deleteUserById(id) {
    return fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
  }

  function updateList(person) { 
    postUser(person)
      .then((res) => {
        if (res.status !== 201) throw new Error("Create failed");
        return res.json(); // created user from backend, includes ._id
      })
      .then((created) => setCharacters((prev) => [...prev, created]))
      .catch((error) => {
        console.log(error);
      });
  }

  function removeOneCharacterById(id) {
    deleteUserById(id)
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prev) => prev.filter((u) => String(u._id) !== String(id)));
        } else if (res.status === 404) {
          console.log("User not found");
        } else {
          console.log("Delete failed");
        }
      })
      .catch((error) => console.log(error));
  }

  function removeOneCharacter(indexOrId) {
    // Table will pass _id when available, otherwise an index (legacy fallback)
    const isIndex = typeof indexOrId === "number";
    if (isIndex) {
      const user = characters[indexOrId];
      if (user && user._id != null) {
        removeOneCharacterById(user._id);
      } else {
        // fallback: remove locally if no _id (shouldn't happen once DB is used)
        setCharacters((prev) => prev.filter((_, i) => i !== indexOrId));
      }
    } else {
      removeOneCharacterById(indexOrId);
    }
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => {
        // backend now returns an array of users, not { users_list: [...] }
        setCharacters(Array.isArray(json) ? json : (json.users_list ?? []));
      })
      .catch((error) => { console.log(error); });
  }, []);

  return (
    <div className="container">
      <h1>First React App</h1>
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter} 
      />
      <h2>Add a Character</h2>
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
