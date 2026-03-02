import React, { useState } from 'react';

function Sidebar({ activeList, setActiveList, listCategories, addNewCategory, deleteCategory, filter, setFilter }) {
    const [newCatName, setNewCatName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const [isFiltersOpen, setIsFiltersOpen] = useState(true);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

    const handleAdd = () => {
        if (newCatName.trim()) {
            addNewCategory(newCatName.trim());
            setNewCatName('');
            setIsAdding(false);
        }
    };

    return (
        <aside className="sol-menu-kutu">

            <div className="sidebar-bolum">
                <div className="sidebar-baslik-satiri" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
                    <h3>Görünüm</h3>
                    <span className="sidebar-ikon">{isFiltersOpen ? '▼' : '▶'}</span>
                </div>

                {isFiltersOpen && (
                    <div className="sidebar-icerik">
                        <button className={`sidebar-filtre-butonu ${filter === 'hepsi' ? 'aktif' : ''}`} onClick={() => setFilter('hepsi')}>Tüm Görevler</button>
                        <button className={`sidebar-filtre-butonu ${filter === 'bekleyen' ? 'aktif' : ''}`} onClick={() => setFilter('bekleyen')}>Bekleyenler</button>
                        <button className={`sidebar-filtre-butonu ${filter === 'biten' ? 'aktif' : ''}`} onClick={() => setFilter('biten')}>Tamamlananlar</button>
                    </div>
                )}
            </div>

            <div className="sidebar-bolum">
                <div className="sidebar-baslik-satiri" onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
                    <h3>Kitabeler</h3>
                    <span className="sidebar-ikon">{isCategoriesOpen ? '▼' : '▶'}</span>
                </div>

                {isCategoriesOpen && (
                    <div className="sidebar-icerik">
                        <ul className="kategori-listesi">
                            {listCategories.map((cat, index) => (
                                <li key={index} className={`kategori-maddesi ${activeList === cat ? 'aktif' : ''}`} onClick={() => setActiveList(cat)}>
                                    <span className="kategori-isim">{cat}</span>
                                    {cat !== 'Ana Görevler' && (
                                        <button className="kategori-sil-butonu" onClick={(e) => { e.stopPropagation(); deleteCategory(cat); }} title="Sil">✖</button>
                                    )}
                                </li>
                            ))}

                            {isAdding ? (
                                <li className="kategori-maddesi ekleme-modu" style={{ padding: 0, backgroundColor: 'transparent', border: 'none' }}>
                                    <input
                                        type="text"
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setIsAdding(false); }}
                                        placeholder="İsim yaz ve Enter..."
                                        className="gizli-input"
                                        autoFocus
                                        onBlur={() => { if (!newCatName.trim()) setIsAdding(false); }}
                                    />
                                </li>
                            ) : (
                                <button className="yeni-kategori-ekle" onClick={() => setIsAdding(true)}>+ Yeni Ekle</button>
                            )}
                        </ul>
                    </div>
                )}
            </div>

        </aside>
    );
}

export default Sidebar;