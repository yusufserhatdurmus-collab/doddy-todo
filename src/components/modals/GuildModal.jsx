// src/components/modals/GuildModal.jsx
// Lonca Merkezi modalı — arkadaş ekleme + liderlik tablosu.

import React from 'react';
import { getPetInfo } from '../../utils/petUtils';

export const GuildModal = ({
  onClose,
  friendCode,
  friendCodeInput,
  setFriendCodeInput,
  onAddFriend,
  guildMembersData,
  trophies,
  level,
  companionType,
  customPetName,
  guildNotify // Mesajları buraya alıyoruz
}) => (
  <div className="modal-arkaplan" onClick={onClose}>
    <div
      className="modal-kutu"
      onClick={(e) => e.stopPropagation()}
      style={{ maxWidth: '600px', width: '90%' }}
    >
      <h3>Lonca Merkezi</h3>

      {/* Arkadaş kodu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
        <span style={{ fontSize: '24px', color: '#a89f91' }}>Özel Kodun:</span>
        <span style={{ fontSize: '36px', color: '#ea580c', fontWeight: 'bold', letterSpacing: '4px' }}>
          {friendCode}
        </span>
      </div>

      {/* YENİ: Şık Bildirim Ekranı */}
      {guildNotify && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: guildNotify.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 38, 38, 0.1)',
          color: guildNotify.type === 'success' ? '#4ade80' : '#f87171',
          border: `1px solid ${guildNotify.type === 'success' ? '#22c55e' : '#dc2626'}`,
          fontSize: '20px'
        }}>
          {guildNotify.text}
        </div>
      )}

      {/* Arkadaş Ekleme Kutusu */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          value={friendCodeInput}
          onChange={(e) => setFriendCodeInput(e.target.value)}
          placeholder="Kod girin..."
          className="intro-input"
          style={{ flex: 1 }}
          maxLength={6}
        />
        <button onClick={onAddFriend} className="intro-buton" style={{ marginTop: 0, width: 'auto' }}>
          EKLE
        </button>
      </div>

      {/* Liderlik tablosu */}
      <h4 style={{ fontSize: '28px', color: '#a89f91', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '15px', paddingBottom: '10px' }}>
        Liderlik Tablosu
      </h4>

      <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
        {/* Kendi satırı */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: 'rgba(234, 88, 12, 0.1)', border: '1px solid #ea580c', borderRadius: '4px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img
              src={getPetInfo(companionType, level).src}
              alt="pet"
              style={{ width: '40px', height: '40px', imageRendering: 'pixelated' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '24px', color: '#ea580c', fontWeight: 'bold' }}>{customPetName} (Sen)</span>
              <span style={{ fontSize: '18px', color: '#a89f91' }}>Lv.{level}</span>
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ea580c' }}>🏆 {trophies}</div>
        </div>

        {/* Guild üyeleri */}
        {guildMembersData.length === 0 ? (
          <p style={{ fontSize: '20px', color: '#8a6c5e', marginTop: '20px' }}>Liste boş.</p>
        ) : (
          guildMembersData.map((member, index) => (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img
                  src={getPetInfo(member.companionType, member.level).src}
                  alt="pet"
                  style={{ width: '40px', height: '40px', imageRendering: 'pixelated' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '24px', color: '#a89f91', fontWeight: 'bold' }}>{member.customPetName}</span>
                  <span style={{ fontSize: '18px', color: '#8a6c5e' }}>Lv.{member.level}</span>
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ea580c' }}>🏆 {member.trophies || 0}</div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onClose}
        className="intro-buton"
        style={{ backgroundColor: 'transparent', borderColor: '#a89f91', color: '#a89f91' }}
      >
        KAPAT
      </button>
    </div>
  </div>
);