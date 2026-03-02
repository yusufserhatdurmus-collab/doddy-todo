// src/components/modals/ResetModal.jsx
// "Macerayı Sıfırla" onay modalı.

import React from 'react';

export const ResetModal = ({ onConfirm, onClose }) => (
  <div className="modal-arkaplan">
    <div className="modal-kutu">
      <h3>Macerayı Sıfırla</h3>
      <p>Tüm bulut verilerin silinecek. Emin misin?</p>
      <div className="modal-butonlar">
        <button className="buton-evet" onClick={onConfirm}>Sıfırla</button>
        <button className="buton-hayir" onClick={onClose}>İptal</button>
      </div>
    </div>
  </div>
);
