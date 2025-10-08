// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
    return promise;
  }

  function deleteUserById(id) {
    return fetch(`http://localhost:8000/users/${id}`, { method: "DELETE" });
  }

  function updateList(person) { 
    postUser(person)
      .then((res) => {
        if (res.status !== 201) throw new Error("Create failed");
        return res.json(); // the created user from backend, includes .id
      })
      .then((created) => setCharacters([...characters, created]))
      .catch((error) => {
        console.log(error);
      });
  }

  function removeOneCharacterById(id) {
    deleteUserById(id)
      .then((res) => {
        if (res.status === 204) {
          setCharacters((prev) => prev.filter((u) => String(u.id) !== String(id)));
        } else if (res.status === 404) {
          console.log("User not found");
        } else {
          console.log("Delete failed");
        }
      })
      .catch((error) => console.log(error));
  }

  function removeOneCharacter(index) {
    const user = characters[index];
    if (user && user.id != null) {
      removeOneCharacterById(user.id);
    } else {}
      const updated = characters.filter((_, i) => i !== index);
      setCharacters(updated);
    }


  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
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
