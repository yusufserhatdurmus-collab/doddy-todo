import React, { useState, memo } from 'react';

function RightPanel({
    pet, displayName, level, xp, resetJourney,
    timeLeft, isTimerActive, setIsTimerActive, setTimeLeft,
    formatTime, handleLogout, openGuild, trophies,
    todos
}) {
    const [activeTab, setActiveTab] = useState('stats');

    const xpPercentage = (xp / 250) * 100;

    // Sadece biten görevleri sayıyoruz
    const commonCount = todos?.filter(t => t.completed && t.priority === 'Sıradan').length || 0;
    const importantCount = todos?.filter(t => t.completed && t.priority === 'Önemli').length || 0;
    const epicCount = todos?.filter(t => t.completed && t.priority === 'Destansı').length || 0;

    // Barların ekrandan taşmaması için en yüksek değeri buluyoruz (oranlama için)
    const maxCount = Math.max(commonCount, importantCount, epicCount, 1); // 0'a bölünmeyi önlemek için en az 1

    return (
        <aside className="sag-menu-kutu" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* ── ÜST KISIM: KARAKTER VE XP BAR ── */}
            <div className="karakter-panosu dikey-hizala" style={{ flexShrink: 0 }}>
                <div className="oyun-baslik" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '30px', color: '#ea580c', textTransform: 'uppercase', fontWeight: 'bold' }}>Yoldaş</span>
                    <button onClick={resetJourney} className="sifirla-butonu" title="Sıfırla">↺</button>
                </div>

                <img src={pet.src} alt="Yoldaş" className="buyuk-avatar serbest-animasyon" style={{ width: '80px', height: '80px' }} />

                <div className="isim-satiri">
                    <span className="pet-isim">{displayName}</span>
                </div>

                <div className="seviye-grubu">
                    <span className="pet-seviye">Lv. {level}</span>
                    <div className="xp-bar-dis">
                        <div className="xp-bar-ic" style={{ width: `${xpPercentage}%` }}></div>
                    </div>
                </div>
                <span style={{ fontSize: '18px', color: '#a89f91', marginTop: '-5px' }}>{xp} / 250 XP</span>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px', color: '#a89f91' }}>Kupa:</span>
                        <span style={{ fontSize: '24px', color: '#ea580c', fontWeight: 'bold' }}>{trophies || 0}</span>
                    </div>
                    <button
                        onClick={openGuild}
                        style={{ backgroundColor: 'transparent', color: '#ea580c', border: '1px solid #ea580c', padding: '5px 10px', borderRadius: '4px', fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#ea580c'; e.target.style.color = '#12100e'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#ea580c'; }}
                    >
                        Lonca
                    </button>
                </div>
            </div>

            {/* ── ORTA KISIM: SEKMELER (TABS) ── */}
            <div style={{ display: 'flex', marginTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                    onClick={() => setActiveTab('stats')}
                    style={{ flex: 1, padding: '10px', backgroundColor: activeTab === 'stats' ? 'rgba(234, 88, 12, 0.1)' : 'transparent', color: activeTab === 'stats' ? '#ea580c' : '#8a6c5e', border: 'none', borderBottom: activeTab === 'stats' ? '2px solid #ea580c' : 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', transition: 'all 0.2s' }}
                >
                    Günlük
                </button>
                <button
                    onClick={() => setActiveTab('timer')}
                    style={{ flex: 1, padding: '10px', backgroundColor: activeTab === 'timer' ? 'rgba(234, 88, 12, 0.1)' : 'transparent', color: activeTab === 'timer' ? '#ea580c' : '#8a6c5e', border: 'none', borderBottom: activeTab === 'timer' ? '2px solid #ea580c' : 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', transition: 'all 0.2s' }}
                >
                    Odaklan
                </button>
            </div>

            {/* ── ALT KISIM: SEKME İÇERİKLERİ ── */}
            <div style={{ flex: 1, padding: '15px 10px', display: 'flex', flexDirection: 'column' }}>

                {/* SAF CSS İSTATİSTİK SEKMESİ (RPG Barları) */}
                {activeTab === 'stats' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                        <h4 style={{ color: '#c2a878', marginBottom: '5px', fontSize: '20px', textAlign: 'center' }}>Av Raporu</h4>

                        {/* Sıradan Görev Barı */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a89f91', fontSize: '14px', marginBottom: '4px' }}>
                                <span>Sıradan</span>
                                <span>{commonCount}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                {/* YENİ: transition silindi */}
                                <div style={{ width: `${(commonCount / maxCount) * 100}%`, height: '100%', backgroundColor: '#a89f91' }}></div>
                            </div>
                        </div>

                        {/* Önemli Görev Barı */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3b82f6', fontSize: '14px', marginBottom: '4px', fontWeight: 'bold' }}>
                                <span>Önemli</span>
                                <span>{importantCount}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                {/* YENİ: transition silindi */}
                                <div style={{ width: `${(importantCount / maxCount) * 100}%`, height: '100%', backgroundColor: '#3b82f6' }}></div>
                            </div>
                        </div>

                        {/* Destansı Görev Barı */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ea580c', fontSize: '14px', marginBottom: '4px', fontWeight: 'bold' }}>
                                <span>Destansı</span>
                                <span>{epicCount}</span>
                            </div>
                            {/* YENİ: box-shadow silindi */}
                            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                {/* YENİ: transition silindi */}
                                <div style={{ width: `${(epicCount / maxCount) * 100}%`, height: '100%', backgroundColor: '#ea580c' }}></div>
                            </div>
                        </div>

                        <p style={{ textAlign: 'center', color: '#8a6c5e', fontSize: '13px', marginTop: 'auto' }}>Tamamlanan görevlerin zorluk dağılımı</p>
                    </div>
                )}

                {/* POMODORO SEKMESİ */}
                {activeTab === 'timer' && (
                    <div className="kum-saati-alani dikey-kum-saati" style={{ marginTop: '10px' }}>
                        <div className="kum-saati-ust">
                            <span style={{ fontSize: '24px', color: '#8a6c5e' }}>Odak Süresi:</span>
                            <span className="zaman-gostergesi">{formatTime(timeLeft)}</span>
                        </div>
                        <div className="kum-saati-alt">
                            <button className="zaman-butonu" onClick={() => setIsTimerActive(!isTimerActive)}>
                                {isTimerActive ? 'DURDUR' : 'BAŞLAT'}
                            </button>
                            <button className="zaman-sifirla" onClick={() => { setIsTimerActive(false); setTimeLeft(25 * 60); }}>↺</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── EN ALT: ÇIKIŞ BUTONU ── */}
            <button className="cikis-butonu" onClick={handleLogout} style={{
                marginTop: 'auto', backgroundColor: 'transparent', border: '1px solid #dc2626', color: '#dc2626',
                padding: '10px', fontSize: '20px', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s',
                flexShrink: 0
            }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#dc2626'; e.target.style.color = '#fff'; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#dc2626'; }}
            >
                Çıkış Yap
            </button>
        </aside>
    );
}

// Akıllı Kalkan 
const arePropsEqual = (prevProps, nextProps) => {
    return (
        prevProps.todos === nextProps.todos &&
        prevProps.xp === nextProps.xp &&
        prevProps.level === nextProps.level &&
        prevProps.timeLeft === nextProps.timeLeft &&
        prevProps.isTimerActive === nextProps.isTimerActive &&
        prevProps.trophies === nextProps.trophies
    );
};

export default memo(RightPanel, arePropsEqual);