import React, { useState } from 'react';
import './App.css';

// Gerekli araçları, kancaları (hooks) ve bileşenleri içeri aktarıyorum.
import { useAuth } from './hooks/useAuth';
import { useTodos } from './hooks/useTodos';
import { useGuild } from './hooks/useGuild';
import { getPetInfo } from './utils/petUtils';

import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import { TodoForm } from './components/TodoForm';
import TodoList from './components/TodoList';

import { LoadingScreen } from './components/screens/LoadingScreen';
import { EmailVerifyScreen } from './components/screens/EmailVerifyScreen';
import { CharacterSelectScreen } from './components/screens/CharacterSelectScreen';

import { GuildModal } from './components/modals/GuildModal';
import { ResetModal } from './components/modals/ResetModal';
import { DeleteCategoryModal } from './components/modals/DeleteCategoryModal';

function App() {
  // Uygulamanın beynini (veritabanı, auth) ayırdığım özel kancalardan (custom hooks) çekiyorum.
  const {
    user, authLoading, todos, xp, setXp, level, setLevel, hasStarted, setHasStarted,
    customPetName, setCustomPetName, companionType, setCompanionType, listCategories,
    setListCategories, trophies, setTrophies, friendCode, friendsList, setFriendsList,
    syncUserStats, handleLogout,
  } = useAuth();

  // Arayüzdeki yan panellerin ve uyarı pencerelerinin (modalların) açık/kapalı durumlarını burada tutuyorum.
  // DİKKAT: Bunları önce tanımlıyorum ki alt taraftaki görev mekanikleri kullanabilsin.
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(window.innerWidth > 1024);
  const [filter, setFilter] = useState('hepsi');
  const [activeList, setActiveList] = useState('Ana Görevler');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showGuildModal, setShowGuildModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Görev (Todo) mekaniklerini ve Mini Boss yeteneklerini sahaya sürüyorum.
  const {
    addTodo, toggleComplete, deleteTodo, saveEdit, addNewCategory, confirmDeleteCategory,
    addSubtask, toggleSubtask, deleteSubtask
  } = useTodos({
    user, todos, activeList, setActiveList, xp, setXp, level, setLevel, trophies,
    setTrophies, listCategories, setListCategories, syncUserStats,
  });

  // Lonca (Guild) ve Odaklanma Zamanlayıcısı (Timer) özelliklerini içeri alıyorum.
  const {
    guildMembersData, friendCodeInput, setFriendCodeInput, timeLeft, setTimeLeft,
    isTimerActive, setIsTimerActive, handleAddFriend, formatTime, guildNotify
  } = useGuild({
    user, friendsList, setFriendsList, friendCode, showGuildModal, xp, setXp,
    level, setLevel, trophies, setTrophies, syncUserStats,
  });

  // Kullanıcının seçtiği kategoriye ve filtreye göre ekranda görünecek görevleri süzüyorum.
  const filteredTodos = todos.filter(
    (todo) =>
      (todo.category || 'Ana Görevler') === activeList &&
      (filter === 'hepsi' || (filter === 'bekleyen' ? !todo.completed : todo.completed)),
  );

  // Kullanıcı giriş yapmamışsa, e-postasını onaylamamışsa veya karakterini seçmemişse onu ilgili ekranlarda bekletiyorum.
  if (authLoading) return <LoadingScreen />;
  if (!user) return <Auth />;

  if (!user.emailVerified) {
    return (
      <EmailVerifyScreen
        email={user.email}
        onConfirm={() => window.location.reload()}
        onBack={handleLogout}
      />
    );
  }

  if (!hasStarted) {
    return (
      <CharacterSelectScreen
        companionType={companionType}
        setCompanionType={setCompanionType}
        customPetName={customPetName}
        setCustomPetName={setCustomPetName}
        onStart={async () => {
          if (!companionType) return alert('Lütfen sınıf seçin.');
          if (!customPetName.trim()) return alert('İsim belirlemelisiniz.');
          await syncUserStats({ hasStarted: true, customPetName, companionType });
          setHasStarted(true);
        }}
      />
    );
  }

  // Kullanıcı maceraya baştan başlamak isterse tüm veritabanını ve oyun içi ilerlemeyi burada temizliyorum.
  const handleReset = async () => {
    const { deleteDoc, doc } = await import('firebase/firestore');
    const { db } = await import('./firebase');
    for (const todo of todos) await deleteDoc(doc(db, 'todos', todo.id));

    const resetData = {
      xp: 0, level: 1, hasStarted: false, customPetName: '',
      companionType: 'fire', listCategories: ['Ana Görevler'], trophies: 0,
    };

    await syncUserStats(resetData);
    setXp(0); setLevel(1); setHasStarted(false);
    setCompanionType('fire'); setCustomPetName('');
    setListCategories(['Ana Görevler']); setActiveList('Ana Görevler'); setTrophies(0);
    setShowResetModal(false);
  };

  // Sayfanın iskeletini (oklar, sol panel, orta parşömen, sağ panel ve modallar) birleştirip ekrana çizdiriyorum.
  return (
    <div className="masa-arkaplan">
      <button
        className={`kenar-ok sol-ok ${isSidebarOpen ? 'acik' : 'kapali'}`}
        onClick={() => setIsSidebarOpen(prev => !prev)}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>
      <button
        className={`kenar-ok sag-ok ${isRightPanelOpen ? 'acik' : 'kapali'}`}
        onClick={() => setIsRightPanelOpen(prev => !prev)}
      >
        {isRightPanelOpen ? '▶' : '◀'}
      </button>

      {showGuildModal && (
        <GuildModal
          onClose={() => setShowGuildModal(false)}
          friendCode={friendCode}
          friendCodeInput={friendCodeInput}
          setFriendCodeInput={setFriendCodeInput}
          onAddFriend={() => handleAddFriend(setShowGuildModal)}
          guildMembersData={guildMembersData}
          trophies={trophies}
          level={level}
          companionType={companionType}
          customPetName={customPetName}
          guildNotify={guildNotify}
        />
      )}

      {showResetModal && <ResetModal onConfirm={handleReset} onClose={() => setShowResetModal(false)} />}

      {categoryToDelete && (
        <DeleteCategoryModal
          categoryName={categoryToDelete}
          onConfirm={() => confirmDeleteCategory(categoryToDelete, setCategoryToDelete)}
          onClose={() => setCategoryToDelete(null)}
        />
      )}
      {showLogoutModal && (
        <div className="modal-arkaplan">
          <div className="modal-kutu">
            <h2 style={{ color: '#dc2626', marginBottom: '15px', fontSize: '28px' }}>Ayrılıyor musun?</h2>
            <p style={{ color: '#a89f91', marginBottom: '25px', fontSize: '18px' }}>Macerana ara vermek istediğine emin misin?</p>
            <div className="modal-butonlar">
              <button className="buton-hayir" onClick={() => setShowLogoutModal(false)}>Kal</button>
              <button className="buton-evet" onClick={() => { setShowLogoutModal(false); handleLogout(); }}>Ayrıl</button>
            </div>
          </div>
        </div>
      )}

      <div className="calisma-masasi-grid">
        <div className={`yan-panel-wrapper sol-panel ${!isSidebarOpen ? 'kapali' : ''}`}>
          <Sidebar
            activeList={activeList} setActiveList={setActiveList}
            listCategories={listCategories} addNewCategory={addNewCategory}
            deleteCategory={(cat) => setCategoryToDelete(cat)}
            filter={filter} setFilter={setFilter}
          />
        </div>

        <main className="orta-parsomen-alani">
          <div className="ana-kart dashboard-modu">
            <div className="orta-ust-bar">
              <h2 className="parsomen-baslik">{activeList}</h2>
            </div>
            <div className="todo-alani">
              <TodoForm onSubmit={addTodo} />
              <TodoList
                filteredTodos={filteredTodos}
                onToggle={toggleComplete} onDelete={deleteTodo} onSaveEdit={saveEdit}
                onAddSubtask={addSubtask} onToggleSubtask={toggleSubtask} onDeleteSubtask={deleteSubtask}
              />
            </div>
          </div>
        </main>

        <div className={`yan-panel-wrapper sag-panel ${!isRightPanelOpen ? 'kapali' : ''}`}>
          <RightPanel
            pet={getPetInfo(companionType, level)} displayName={customPetName || 'Yoldaş'}
            level={level} xp={xp} resetJourney={() => setShowResetModal(true)}
            timeLeft={timeLeft} isTimerActive={isTimerActive} setIsTimerActive={setIsTimerActive}
            setTimeLeft={setTimeLeft} formatTime={formatTime} handleLogout={() => setShowLogoutModal(true)}
            openGuild={() => setShowGuildModal(true)} trophies={trophies} todos={todos}
          />
        </div>
      </div>
    </div>
  );
}

export default App;