// src/MyApp.jsx
import React, { useState } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  // Remove a character by row index
  function removeOneCharacter(index) {
    const updated = characters.filter((_, i) => i !== index);
    setCharacters(updated);
  }

  // Add new character from form
  function updateList(person) {
    setCharacters([...characters, person]);
  }

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
