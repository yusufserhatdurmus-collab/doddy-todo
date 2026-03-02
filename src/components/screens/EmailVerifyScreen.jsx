// src/components/screens/EmailVerifyScreen.jsx
import React from 'react';

export const EmailVerifyScreen = ({ email, onConfirm, onBack }) => (
  <div className="masa-arkaplan">
    <div className="intro-ekrani">
      <h1 className="intro-baslik">Onay Bekleniyor</h1>
      <p className="intro-metin">
        Giriş yapmak için <b>{email}</b> adresine gönderdiğimiz bağlantıya tıklayın.
      </p>
      <button className="intro-buton" onClick={onConfirm}>ONAYLADIM</button>
      <button className="auth-gecis-butonu" onClick={onBack}>Geri Dön</button>
    </div>
  </div>
);
