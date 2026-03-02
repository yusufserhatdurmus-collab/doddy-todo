// src/hooks/useTodos.js
// addTodo, toggleComplete, deleteTodo, saveEdit,
// addNewCategory, confirmDeleteCategory işlemlerini kapsar.

import { doc, setDoc, updateDoc, deleteDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getColorByPriority } from '../utils/petUtils';

export const useTodos = ({
  user,
  todos,
  activeList,
  setActiveList,
  xp, setXp,
  level, setLevel,
  trophies, setTrophies,
  listCategories, setListCategories,
  syncUserStats,
}) => {

  // Todo ekleme 
  const addTodo = async (e, { inputValue, setInputValue, dueDate, setDueDate, priority, setPriority }) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    const assignedColor = getColorByPriority(priority);

    await setDoc(doc(collection(db, 'todos')), {
      text: inputValue,
      completed: false,
      color: assignedColor,
      category: activeList,
      userId: user.uid,
      createdAt: serverTimestamp(),
      dueDate: dueDate || null,
      priority,
      subtasks: []
    });

    setInputValue('');
    setDueDate('');
    setPriority('Sıradan');
  };

  // Tamamlandı toggle + XP/kupa hesabı 
  const toggleComplete = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    let xpGain = 10;
    if (todo.priority === 'Önemli') xpGain = 15;
    if (todo.priority === 'Destansı') xpGain = 25;

    const trofeGain = todo.priority === 'Destansı' ? 5 : todo.priority === 'Önemli' ? 3 : 2;

    let newXp = xp;
    let newLevel = level;
    let newTrophies = trophies;

    if (!todo.completed) {
      newXp += xpGain;
      newTrophies += trofeGain;
      if (newXp >= 250) { newLevel += 1; newXp -= 250; }
    } else {
      newXp -= xpGain;
      newTrophies = Math.max(0, newTrophies - trofeGain);
      if (newXp < 0 && newLevel > 1) { newLevel -= 1; newXp += 250; }
      else if (newXp < 0) newXp = 0;
    }

    await updateDoc(doc(db, 'todos', id), { completed: !todo.completed });
    await syncUserStats({ xp: newXp, level: newLevel, trophies: newTrophies });
    setXp(newXp); setLevel(newLevel); setTrophies(newTrophies);
  };

  // Silme 
  const deleteTodo = async (id) => deleteDoc(doc(db, 'todos', id));

  // Düzenleme kaydetme
  const saveEdit = async (id, editValue, setEditingId) => {
    if (!editValue.trim()) return;
    await updateDoc(doc(db, 'todos', id), { text: editValue });
    setEditingId(null);
  };

  // Yeni kategori 
  const addNewCategory = async (newCat) => {
    if (newCat && !listCategories.includes(newCat.trim())) {
      const newList = [...listCategories, newCat.trim()];
      setListCategories(newList);
      await syncUserStats({ listCategories: newList });
      setActiveList(newCat.trim());
    }
  };

  //  Kategori silme (onay sonrası)
  const confirmDeleteCategory = async (categoryToDelete, setCategoryToDelete) => {
    if (!categoryToDelete || !user) return;

    const newList = listCategories.filter((c) => c !== categoryToDelete);
    setListCategories(newList);
    await syncUserStats({ listCategories: newList });

    const categoryTodos = todos.filter((t) => t.category === categoryToDelete);
    for (const todo of categoryTodos) await deleteDoc(doc(db, 'todos', todo.id));

    if (activeList === categoryToDelete) setActiveList('Ana Görevler');
    setCategoryToDelete(null);
  };


  //  ALT GÖREV (MİNİ BOSS) VERİTABANI İŞLEMLERİ


  const addSubtask = async (todoId, subtaskText) => {
    if (!subtaskText.trim()) return;
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;

    const currentSubtasks = todo.subtasks || [];
    const newSubtask = {
      id: Date.now().toString(), // Benzersiz bir ID veriyoruz
      text: subtaskText.trim(),
      completed: false
    };

    // İlgili dokümanın subtasks dizisini Firestore'da güncelliyoruz
    await updateDoc(doc(db, 'todos', todoId), {
      subtasks: [...currentSubtasks, newSubtask]
    });
  };

  const toggleSubtask = async (todoId, subtaskId) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo || !todo.subtasks) return;

    // Sadece tıklanan alt görevin durumunu tersine çevir (true <-> false)
    const updatedSubtasks = todo.subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    await updateDoc(doc(db, 'todos', todoId), {
      subtasks: updatedSubtasks
    });
  };

  const deleteSubtask = async (todoId, subtaskId) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo || !todo.subtasks) return;

    // Silinmek istenen alt görevi diziden çıkarıyoruz
    const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtaskId);

    await updateDoc(doc(db, 'todos', todoId), {
      subtasks: updatedSubtasks
    });
  };

  // Yeni yetenekleri dışarı aktarıyoruz
  return {
    addTodo, toggleComplete, deleteTodo, saveEdit, addNewCategory, confirmDeleteCategory,
    addSubtask, toggleSubtask, deleteSubtask
  };
};