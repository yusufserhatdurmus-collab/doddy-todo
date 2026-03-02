// src/components/TodoForm.jsx
// Görev ekleme formu. Kendi lokal state'ini (inputValue, dueDate, priority) yönetir.
// onSubmit'e hazır parametreleri paketleyerek gönderir.

import React, { useState } from 'react';
import { getColorByPriority } from '../utils/petUtils';

export const TodoForm = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate]       = useState('');
  const [priority, setPriority]     = useState('Sıradan');

  const handleSubmit = (e) => {
    onSubmit(e, { inputValue, setInputValue, dueDate, setDueDate, priority, setPriority });
  };

  return (
    <form onSubmit={handleSubmit} className="todo-formu-kapsayici">
      <div className="todo-formu">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Yeni bir görev yaz..."
          className={`modern-input murekkep-${getColorByPriority(priority)}`}
        />
        <button type="submit" className="modern-buton">Ekle</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
        <div className="ekstra-girdi-alani">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="modern-secim"
          >
            <option value="Sıradan">Sıradan</option>
            <option value="Önemli">Önemli</option>
            <option value="Destansı">Destansı</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="modern-tarih"
          />
        </div>
      </div>
    </form>
  );
};
