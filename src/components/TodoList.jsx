import React, { useState, memo } from 'react';

const getDaysDifference = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-');
  const dueDate = new Date(year, month - 1, day);
  dueDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const getDeadlineInfo = (dateString, completed) => {
  if (!dateString) return { text: '', isUrgent: false, isOverdue: false };
  const normalTarih = dateString.split('-').reverse().join('.');
  if (completed) return { text: normalTarih, isUrgent: false, isOverdue: false };

  const diffDays = getDaysDifference(dateString);

  if (diffDays < 0) return { text: `(Gecikti: ${Math.abs(diffDays)} Gün)`, isUrgent: true, isOverdue: true };
  if (diffDays === 0) return { text: '🔥 BUGÜN BİTİYOR!', isUrgent: true, isOverdue: false };
  if (diffDays === 1) return { text: '⚡ YARIN!', isUrgent: true, isOverdue: false };
  if (diffDays > 1 && diffDays <= 3) return { text: `⏳ Son ${diffDays} Gün`, isUrgent: false, isOverdue: false };

  return { text: normalTarih, isUrgent: false, isOverdue: false };
};

const TodoList = memo(({
  filteredTodos, onToggle, onDelete, onSaveEdit,
  onAddSubtask, onToggleSubtask, onDeleteSubtask
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const [addingSubtaskId, setAddingSubtaskId] = useState(null);
  const [subtaskInput, setSubtaskInput] = useState('');

  const [expandedTasks, setExpandedTasks] = useState({});

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const handleSave = (id) => {
    onSaveEdit(id, editValue, setEditingId);
  };

  const handleAddSubtaskSubmit = (todoId) => {
    if (subtaskInput.trim()) {
      onAddSubtask(todoId, subtaskInput);
    }
    setAddingSubtaskId(null);
    setSubtaskInput('');
  };

  const toggleExpand = (todoId, e) => {
    if (e) e.stopPropagation();
    setExpandedTasks(prev => ({ ...prev, [todoId]: !prev[todoId] }));
  };

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return 0;
  });

  return (
    <ul className="todo-listesi scroll-alani">
      {sortedTodos.map((todo) => {
        const { text: deadlineText, isUrgent, isOverdue } = getDeadlineInfo(todo.dueDate, todo.completed);

        const subtasks = todo.subtasks || [];
        const completedSubtasks = subtasks.filter(st => st.completed).length;
        const totalSubtasks = subtasks.length;
        const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

        const isExpanded = expandedTasks[todo.id] || addingSubtaskId === todo.id;

        return (
          <li key={todo.id} className={`todo-maddesi ${todo.completed ? 'tamamlandi' : ''} ${isUrgent && !todo.completed ? 'acil-gorev' : ''}`}>

            {/* --- ANA GÖREV SATIRI --- */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="todo-icerik" onClick={() => editingId !== todo.id && onToggle(todo.id)}>
                {editingId === todo.id ? (
                  <div className="duzenleme-alani" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className={`duzenle-input murekkep-${todo.color}`}
                      style={{ color: '#a8a29e' }}
                      autoFocus
                    />
                    <button onClick={() => handleSave(todo.id)} className="kaydet-butonu">Kaydet</button>
                  </div>
                ) : (
                  <>
                    <input type="checkbox" checked={todo.completed} readOnly className="modern-checkbox" />
                    <span className={`todo-metni murekkep-${todo.color}`}>{todo.text}</span>
                  </>
                )}
              </div>

              {editingId !== todo.id && (
                <div className="aksiyon-butonlari" style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                  {/* YENİ: flexShrink: 0 zırhı eklendi, butonlar artık sola kayamaz! */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (addingSubtaskId === todo.id) {
                        setAddingSubtaskId(null);
                      } else {
                        setAddingSubtaskId(todo.id);
                        setSubtaskInput('');
                        setExpandedTasks(prev => ({ ...prev, [todo.id]: true }));
                      }
                    }}
                    title="Alt Görev Ekle"
                    style={{ background: 'none', border: '1px solid rgba(234, 88, 12, 0.4)', color: '#ea580c', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontSize: '18px' }}
                  >
                    +
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); startEdit(todo); }} className="duzenle-butonu" title="Düzenle">✎</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }} className="sil-butonu" title="Sil">✖</button>
                </div>
              )}
            </div>

            {/* --- ETİKETLER --- */}
            {editingId !== todo.id && (
              <div className="todo-meta-alani" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                {(todo.priority === 'Destansı' || todo.priority === 'Önemli') && (
                  <span className={`oncelik-rozet ${todo.priority === 'Destansı' ? 'destansi' : 'onemli'}`}>
                    {todo.priority === 'Destansı' ? 'Destansı' : 'Önemli'}
                  </span>
                )}
                {todo.dueDate && (
                  <span className={`tarih-rozet ${isOverdue ? 'gecikmis' : isUrgent ? 'acil' : ''}`}>
                    {deadlineText}
                  </span>
                )}

                {totalSubtasks > 0 && (
                  <span
                    onClick={(e) => toggleExpand(todo.id, e)}
                    className="oncelik-rozet"
                    style={{
                      backgroundColor: isExpanded ? 'rgba(234, 88, 12, 0.1)' : 'rgba(138, 108, 94, 0.1)',
                      color: isExpanded ? '#ea580c' : '#a89f91',
                      border: `1px solid ${isExpanded ? '#ea580c' : '#57534e'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.2s',
                      userSelect: 'none'
                    }}
                    onMouseOver={(e) => { e.target.style.borderColor = '#ea580c'; e.target.style.color = '#ea580c'; }}
                    onMouseOut={(e) => {
                      if (!isExpanded) {
                        e.target.style.borderColor = '#57534e';
                        e.target.style.color = '#a89f91';
                      }
                    }}
                  >
                    {isExpanded ? '▼ Gizle' : `▶ ${completedSubtasks}/${totalSubtasks} Mini Boss`}
                  </span>
                )}
              </div>
            )}

            {/* --- ALT GÖREVLER ALANI --- */}
            {isExpanded && (
              <div style={{ marginTop: '15px', paddingLeft: '20px', marginLeft: '5px', borderLeft: '2px dashed rgba(138, 108, 94, 0.3)' }}>

                {totalSubtasks > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8a6c5e', marginBottom: '4px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      <span>ALT GÖREVLER</span>
                      <span>{completedSubtasks} / {totalSubtasks}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: progressPercentage === 100 ? '#22c55e' : '#ea580c', transition: 'width 0.4s ease' }}></div>
                    </div>
                  </div>
                )}

                {subtasks.map(st => (
                  <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => onToggleSubtask(todo.id, st.id)}
                      className="modern-checkbox"
                      style={{ width: '16px', height: '16px', border: '1px solid #ea580c' }}
                    />
                    <span style={{
                      fontSize: '15px', flex: 1, cursor: 'pointer',
                      color: st.completed ? '#000000' : '#000000',
                      textDecoration: st.completed ? 'line-through' : 'none'
                    }} onClick={() => onToggleSubtask(todo.id, st.id)}>
                      {st.text}
                    </span>
                    <button
                      onClick={() => onDeleteSubtask(todo.id, st.id)}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '14px' }}
                    >
                      ✖
                    </button>
                  </div>
                ))}

                {addingSubtaskId === todo.id && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: totalSubtasks > 0 ? '10px' : '0' }}>
                    <input
                      type="text"
                      autoFocus
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddSubtaskSubmit(todo.id);
                        if (e.key === 'Escape') setAddingSubtaskId(null);
                      }}
                      placeholder="Alt görev..."
                      style={{
                        flex: 1, minWidth: 0, padding: '6px 10px', fontSize: '14px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid #4a3f35',
                        color: '#000000', borderRadius: '4px', outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => handleAddSubtaskSubmit(todo.id)}
                      style={{ backgroundColor: '#ea580c', color: '#12100e', border: 'none', padding: '0 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase' }}
                    >
                      Ekle
                    </button>
                  </div>
                )}

                {totalSubtasks > 0 && addingSubtaskId !== todo.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setAddingSubtaskId(todo.id); setSubtaskInput(''); }}
                    style={{ background: 'none', border: 'none', color: '#8a6c5e', fontSize: '13px', cursor: 'pointer', marginTop: '8px', padding: 0 }}
                  >
                    + Yeni Alt Görev
                  </button>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
});

const areTodosEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.filteredTodos) === JSON.stringify(nextProps.filteredTodos);
};

export default memo(TodoList, areTodosEqual);