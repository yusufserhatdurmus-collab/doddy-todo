// src/components/modals/DeleteCategoryModal.jsx
// "Kitabeyi Sil" onay modalı.

import React from 'react';

export const DeleteCategoryModal = ({ categoryName, onConfirm, onClose }) => (
  <div className="modal-arkaplan">
    <div className="modal-kutu">
      <h3>Kitabeyi Sil</h3>
      <p>"{categoryName}" silinecek. Emin misin?</p>
      <div className="modal-butonlar">
        <button className="buton-evet" onClick={onConfirm}>Evet, Sil</button>
        <button className="buton-hayir" onClick={onClose}>İptal</button>
      </div>
    </div>
  </div>
);
