import React from 'react';
import { getPetInfo } from '../../utils/petUtils';

export const CharacterSelectScreen = ({
  companionType,
  setCompanionType,
  customPetName,
  setCustomPetName,
  onStart,
}) => {

  const renderSelectedEvolution = () => {
    if (!companionType) return null;

    const levels = [1, 2, 3, 4, 5, 6, 7];

    return (
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid #ea580c',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: 'inset 0 0 15px rgba(234, 88, 12, 0.1)'
      }}>
        <h3 style={{ color: '#c2a878', marginBottom: '15px', fontSize: '26px', textTransform: 'uppercase' }}>
          Evrim Ağacı Önizlemesi
        </h3>
        {/* flexWrap: 'wrap' sayesinde telefonda sığmayan aşamalar alt satıra geçer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {levels.map((lvl, index) => {
            const pet = getPetInfo(companionType, lvl);
            const size = 30 + (lvl * 5);

            return (
              <React.Fragment key={lvl}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={pet.src}
                    alt={`Lv${lvl}`}
                    style={{ width: `${size}px`, height: `${size}px`, imageRendering: 'pixelated', marginBottom: '5px' }}
                    title={`Seviye ${lvl}: ${pet.defaultName}`}
                  />
                  <span style={{ fontSize: '16px', color: '#a89f91' }}>Lv.{lvl}</span>
                </div>
                {index < levels.length - 1 && <span style={{ color: '#8a6c5e', fontSize: '18px', margin: '0 5px' }}>▶</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="masa-arkaplan">
      <div className="intro-ekrani" style={{ maxWidth: '900px', width: '95%' }}>
        <h1 className="intro-baslik">Yoldaşını Seç</h1>
        <p className="intro-metin" style={{ fontSize: '22px', marginBottom: '30px' }}>
          Maceran boyunca seninle birlikte gelişecek elementini seç. (Tüm evrimi görmek için tıkla)
        </p>

        <div className="starter-secim-alani" style={{ gap: '20px', justifyContent: 'center' }}>

          <div
            className={`starter-kutu ${companionType === 'fire' ? 'secili' : ''}`}
            onClick={() => setCompanionType('fire')}
            style={{ width: '160px', padding: '20px' }}
          >
            <img src={getPetInfo('fire', 3).src} alt="Ateş" style={{ width: '60px', height: '60px', imageRendering: 'pixelated', marginBottom: '10px' }} />
            <span className="starter-isim" style={{ fontSize: '24px', color: '#ea580c', fontWeight: 'bold' }}>Ateş Serisi</span>
          </div>

          <div
            className={`starter-kutu ${companionType === 'forest' ? 'secili' : ''}`}
            onClick={() => setCompanionType('forest')}
            style={{ width: '160px', padding: '20px' }}
          >
            <img src={getPetInfo('forest', 3).src} alt="Orman" style={{ width: '60px', height: '60px', imageRendering: 'pixelated', marginBottom: '10px' }} />
            <span className="starter-isim" style={{ fontSize: '24px', color: '#16a34a', fontWeight: 'bold' }}>Orman Serisi</span>
          </div>

          <div
            className={`starter-kutu ${companionType === 'feline' ? 'secili' : ''}`}
            onClick={() => setCompanionType('feline')}
            style={{ width: '160px', padding: '20px' }}
          >
            <img src={getPetInfo('feline', 3).src} alt="Gölge" style={{ width: '60px', height: '60px', imageRendering: 'pixelated', marginBottom: '10px' }} />
            <span className="starter-isim" style={{ fontSize: '24px', color: '#9333ea', fontWeight: 'bold' }}>Gölge Serisi</span>
          </div>

        </div>

        {renderSelectedEvolution()}

        {/* YENİ: Mobilde %100, PC'de max 400px genişlik ile tam uyum sağlandı */}
        <input
          type="text"
          className="intro-input"
          style={{ width: '100%', maxWidth: '400px', margin: '30px auto 15px auto', display: 'block' }}
          placeholder="Yoldaşına İsim Ver..."
          value={customPetName}
          onChange={(e) => setCustomPetName(e.target.value)}
          maxLength={15}
        />

        <button
          className="intro-buton"
          style={{ width: '100%', maxWidth: '400px' }}
          onClick={onStart}
        >
          MACERAYA BAŞLA
        </button>
      </div>
    </div>
  );
};