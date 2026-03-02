// src/hooks/useGuild.js
// Lonca üyelerini çekme, arkadaş ekleme ve Pomodoro timer mantığı bu hook'ta.

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const useGuild = ({
  user, friendsList, setFriendsList, friendCode, showGuildModal,
  xp, setXp, level, setLevel, trophies, setTrophies, syncUserStats,
}) => {
  const [guildMembersData, setGuildMembersData] = useState([]);
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // YENİ: Han duyurularını (başarılı/hata) tutacağımız hafıza
  const [guildNotify, setGuildNotify] = useState(null);

  // Lonca üyelerini çek (modal açıldığında) 
  useEffect(() => {
    const fetchGuildMembers = async () => {
      if (friendsList.length > 0) {
        try {
          const q = query(collection(db, 'users'), where('friendCode', 'in', friendsList));
          const snapshot = await getDocs(q);
          const members = snapshot.docs.map((d) => d.data());
          members.sort((a, b) => (b.trophies || 0) - (a.trophies || 0));
          setGuildMembersData(members);
        } catch (err) {
          console.error('Lonca verisi çekilemedi:', err);
        }
      } else {
        setGuildMembersData([]);
      }
    };
    if (showGuildModal) {
      fetchGuildMembers();
      setGuildNotify(null); // Modal her açıldığında eski mesajları temizle
    }
  }, [showGuildModal, friendsList]);

  // Pomodoro timer 
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      clearInterval(interval);

      let newXp = xp + 25;
      let newLevel = level;
      let newTrophies = trophies + 5;
      if (newXp >= 250) { newLevel += 1; newXp -= 250; }

      setXp(newXp); setLevel(newLevel); setTrophies(newTrophies);
      if (user) {
        updateDoc(doc(db, 'users', user.uid), { xp: newXp, level: newLevel, trophies: newTrophies })
          .catch((err) => console.error(err));
      }
      alert('Odaklanma süresi tamamlandı! +25 XP ve +5 Kupa kazandın.');
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, xp, level, trophies, user]);

  // Arkadaş ekleme (Çirkin alert'ler şık bildirimlere dönüştü)
  const handleAddFriend = async () => {
    setGuildNotify(null); // Önceki mesajı sil
    if (!friendCodeInput.trim()) return;
    const code = friendCodeInput.trim().toUpperCase();

    if (code === friendCode) {
      return setGuildNotify({ type: 'error', text: 'Kendi kodunu ekleyemezsin.' });
    }
    if (friendsList.includes(code)) {
      return setGuildNotify({ type: 'error', text: 'Bu yoldaş zaten loncanda.' });
    }

    try {
      const q = query(collection(db, 'users'), where('friendCode', '==', code));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const newFriendsList = [...friendsList, code];
        setFriendsList(newFriendsList);
        await syncUserStats({ friendsList: newFriendsList });
        setFriendCodeInput('');
        setGuildNotify({ type: 'success', text: 'Yoldaş başarıyla loncaya katıldı!' });
      } else {
        setGuildNotify({ type: 'error', text: 'Bu koda sahip bir yoldaş bulunamadı.' });
      }
    } catch (err) {
      console.error('Arkadaş ekleme hatası:', err);
      setGuildNotify({ type: 'error', text: 'Beklenmedik bir büyü ters tepti.' });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    guildMembersData,
    friendCodeInput, setFriendCodeInput,
    timeLeft, setTimeLeft,
    isTimerActive, setIsTimerActive,
    handleAddFriend,
    formatTime,
    guildNotify // Bildirimleri dışarı aktarıyoruz
  };
};