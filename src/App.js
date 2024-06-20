// src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !photo) {
      alert("Будь ласка, введіть унікальний номер і завантажте фото.");
      return;
    }

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("photo", photo);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Файл успішно завантажено");
    } catch (error) {
      console.error("Помилка завантаження файлу:", error);
      alert("Помилка завантаження файлу");
    }
  };

  return (
    <div className="form-container">
      <h2>Форма для завантаження фотографії</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phone">Унікальний номер</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Додати фото</label>
          <input
            type="file"
            id="photo"
            onChange={(e) => setPhoto(e.target.files[0])}
            accept="image/*"
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Надіслати</button>
        </div>
      </form>
    </div>
  );
}

export default App;
