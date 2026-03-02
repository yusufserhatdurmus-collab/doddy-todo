Doddy Görev Yönetimi ve Gelişim Sistemi
Bu çalışma, klasik bir yapılacaklar listesini oyun mekanikleriyle birleştirerek kullanıcı motivasyonunu artırmayı hedefleyen bir web uygulamasıdır.Farklı bir deneyim ve monoton bir "to-do" uygulaması yerine böyle bir şey tercih ettim. Kullanıcılar tamamladıkları her görevden tecrübe puanı kazanarak seviye atlar ve seçtikleri dijital yoldaşlarını geliştirirler.

Canlı Uygulama Adresi
https://doddy-todo.vercel.app/

Teknik Altyapı
Uygulamanın ön yüzü yaparken ve uğraşırken pekiştirip tecrübe kazanmak amacıyla React ve Vite kullanılarak geliştirdim.Verilerin kalıcı olması ve kullanıcı yönetimi için Firebase Firestore ve Firebase Auth servislerinden yararlandım. Uygulama, Vercel üzerinden sürekli canlı tutulmaktadır.

Kurulum ve Çalıştırma
Projeyi kendi bilgisayarınızda çalıştırmak için dosyaları indirdikten sonra terminal üzerinden şu adımları izleyebilirsiniz:

npm install komutuyla gerekli paketleri yükleyin.

Firebase bağlantı bilgilerini içeren bir yapılandırma dosyası hazırlayın.

npm run dev komutuyla uygulamayı başlatın.

Geliştirme Süreci ve Yapay Zeka Katkısı:
Bu projenin geliştirilmesinde yapay zeka araçlarından bir danışman gibi faydalandım ancak uygulamanın tüm mimari yapısını ve oyun mantığını kendi kararlarımla şekillendirdim.

Yapay zekayı kullandığım noktalar:
Özellikle Firebase veritabanı sorgularının kurgulanmasında ve verilerin asenkron olarak çekilmesi sırasında karşılaştığım teknik hataların çözümünde fikir aldım. Ayrıca mobil uyumluluk için gereken CSS hesaplamalarında bazı temel taslaklar oluşturdum.

Yapay zeka çıktılarında yaptığım müdahaleler:
Yapay zekanın ürettiği standart liste yapılarını, projenin RPG ruhuna uygun hale getirmek için tamamen değiştirdim. Hazır gelen kodları kopyalayıp kullanmak yerine, projenin performansını artırmak amacıyla React bileşenlerini (memoization gibi yöntemlerle) kendim optimize ettim. Standart hata mesajlarını ve kullanıcı yönlendirmelerini, uygulamanın kendine has diline göre yeniden yazdım.
Kodun Yeniden Yapılandırılması (Refactoring) ve Müdahalelerim:
Geliştirme sürecinin ortasında, uygulamanın büyümesiyle birlikte App.jsx dosyasının çok karmaşıklaştığını fark ettim. Bu noktada Claude desteğiyle kapsamlı bir refactoring süreci yürüttüm. Tüm iş mantığını (Business Logic); useAuth, useTodos ve useGuild gibi özel kancalara (Custom Hooks) parçalayarak kodun okunabilirliğini ve bakımını kolaylaştırdım. Hazır gelen kodları kopyalayıp kullanmak yerine, projenin performansını artırmak amacıyla React bileşenlerini kendim optimize ettim.
Tamamen bana ait olan kısımlar:
Uygulamanın seviye atlama algoritması, XP kazanım dengesi ve karakter gelişim mantığı tamamen kendi kurgumdur. Bunun yanı sıra görsel tasarımın tamamı, renk paleti seçimi ve kullanıcı deneyimi akışı benim tarafımdan planlanıp uygulanmıştır. Lonca sistemi ve arkadaş ekleme gibi sosyal özelliklerin mantıksal kurgusu da yine tamamen bana aittir.