// src/hooks/useAuth.js
// Firebase Auth + ilk Firestore veri yükleme + todo listener bu hook'ta yaşar.
// App.jsx'e tek bir obje return eder; tüm auth/user state'leri buradan gelir.

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc,
  collection, onSnapshot, query, where, orderBy,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const generateFriendCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [customPetName, setCustomPetName] = useState('');
  const [companionType, setCompanionType] = useState(null);
  const [listCategories, setListCategories] = useState(['Ana Görevler']);
  const [trophies, setTrophies] = useState(0);
  const [friendCode, setFriendCode] = useState('');
  const [friendsList, setFriendsList] = useState([]);

  // Firestore'daki user dokümanına kısmi güncelleme yapar.
  // İçindeki her async fonksiyona ayrı ayrı import etmek yerine
  // buradan prop olarak geçirmek yeterli.
  const syncUserStats = async (updates) => {
    if (user) {
      try { await updateDoc(doc(db, 'users', user.uid), updates); }
      catch (err) { console.error('syncUserStats hatası:', err); }
    }
  };

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    let unsubscribeTodos = () => { };

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // E-posta doğrulanmadıysa sadece loading'i kapat, veri çekme.
        if (!currentUser.emailVerified) { setAuthLoading(false); return; }

        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setXp(data.xp || 0);
            setLevel(data.level || 1);
            setHasStarted(data.hasStarted || false);
            setCustomPetName(data.customPetName || '');
            setCompanionType(data.companionType || 'fire');
            setListCategories(data.listCategories || ['Ana Görevler']);
            setTrophies(data.trophies || 0);
            setFriendsList(data.friendsList || []);

            if (!data.friendCode) {
              const newCode = generateFriendCode();
              setFriendCode(newCode);
              await updateDoc(userDocRef, {
                friendCode: newCode,
                trophies: data.trophies || 0,
                friendsList: [],
              });
            } else {
              setFriendCode(data.friendCode);
            }
          } else {
            // Yeni kullanıcı — ilk kez doküman oluştur
            const newCode = generateFriendCode();
            setFriendCode(newCode);
            await setDoc(userDocRef, {
              xp: 0, level: 1, hasStarted: false, companionType: 'fire',
              listCategories: ['Ana Görevler'], friendCode: newCode,
              trophies: 0, friendsList: [],
            });
          }

          // Gerçek zamanlı todo listener
          const q = query(
            collection(db, 'todos'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
          );
          unsubscribeTodos = onSnapshot(q, (snapshot) => {
            setTodos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          });
        } catch (err) {
          console.error('Firestore hatası:', err);
        }
      } else {
        setUser(null);
        setTodos([]);
      }
      setAuthLoading(false);
    });

    return () => { unsubscribeAuth(); unsubscribeTodos(); };
  }, []);

  return {
    user, authLoading,
    todos, setTodos,
    xp, setXp,
    level, setLevel,
    hasStarted, setHasStarted,
    customPetName, setCustomPetName,
    companionType, setCompanionType,
    listCategories, setListCategories,
    trophies, setTrophies,
    friendCode,
    friendsList, setFriendsList,
    syncUserStats,
    handleLogout,
  };
};
