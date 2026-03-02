// src/utils/petUtils.js
// Öncelik rengini döndürür. TodoForm ve TodoList'te kullanılır.
export const getColorByPriority = (pri) => {
  if (pri === 'Destansı') return 'kirmizi';
  if (pri === 'Önemli') return 'mavi';
  return 'kahve';
};

// Tip ve seviyeye göre pet sprite + varsayılan isim döndürür.
// App.jsx, CharacterSelectScreen ve GuildModal tarafından import edilir.
export const getPetInfo = (type, lvl) => {
  const t = type || 'fire';
  const l = lvl || 1;

  if (t === 'fire') {
    if (l === 1) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/175.gif', defaultName: 'Sıcak Yumurta' };
    if (l === 2) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/37.gif', defaultName: 'Kıvılcım Tilkisi' };
    if (l === 3) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/58.gif', defaultName: 'Ateş Köpeği' };
    if (l === 4) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif', defaultName: 'Ateş Yavrusu' };
    if (l === 5) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/5.gif', defaultName: 'Hırçın Sürüngen' };
    if (l === 6) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif', defaultName: 'Ateş Ejderi' };
    return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/6.gif', defaultName: 'Efsanevi Kara Ejder' };
  }

  if (t === 'forest') {
    if (l === 1) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/175.gif', defaultName: 'Doğa Tohumu' };
    if (l === 2) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif', defaultName: 'Orman Yavrusu' };
    if (l === 3) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/2.gif', defaultName: 'Sarmaşık Ruhu' };
    if (l === 4) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/3.gif', defaultName: 'Orman Golemi' };
    if (l === 5) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/253.gif', defaultName: 'Bıçak Yaprak' };
    if (l === 6) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/254.gif', defaultName: 'Doğa Muhafızı' };
    return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/384.gif', defaultName: 'Göklerin Hakimi' };
  }

  if (t === 'feline') {
    if (l === 1) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/175.gif', defaultName: 'Karanlık Yumurta' };
    if (l === 2) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/509.gif', defaultName: 'Gölge Kedisi' };
    if (l === 3) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/510.gif', defaultName: 'Gece Avcısı' };
    if (l === 4) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/359.gif', defaultName: 'Felaket Habercisi' };
    if (l === 5) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/405.gif', defaultName: 'Yıldırım Pençesi' };
    if (l === 6) return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/243.gif', defaultName: 'Fırtına Kaplanı' };
    return { src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/150.gif', defaultName: 'Psişik İmparator' };
  }
};
