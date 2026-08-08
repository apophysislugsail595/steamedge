# Kullanım

[English](../en/TUTORIAL.md) · [Türkçe](../tr/TUTORIAL.md) · [Deutsch](../de/TUTORIAL.md) · [Español](../es/TUTORIAL.md) · [繁體中文](../zh/TUTORIAL.md)

Bu sayfa, insanların SteamEdge'i gerçekten kullandığı dört işi anlatır. Giriş yapmış
olduğunu varsayar - yapmadıysan önce [Kurulum](./SETUP.md).

---

## 1. İlk kartlarını topla

**Kart Düşür** sekmesi.

1. **Oyun Listesini Yenile**'ye bas. SteamEdge Steam rozet sayfalarını okur ve hâlâ kart
   düşürecek her oyunu listeler.
2. Bir **düşürme modu** seç (aşağıda anlatılıyor).
3. **Başlat**'a bas.

Hepsi bu. Pencereyi açık bırak - ya da ayarlardan etkinleştirdiysen sistem tepsisine
küçült. Düşen kartlar **Son Düşüşler** bölümünde belirir.

### Hangi modu seçmeliyim?

| Mod | Ne yapar | Ne zaman |
|---|---|---|
| **Sıralı** | Kuyruk sırasına göre tek tek. | Öngörülebilir, basit davranış istiyorsan. |
| **Çok Kartlı** | En çok kartı kalan oyunlar önce. | En hızlı şekilde en çok kartı istiyorsan. |
| **Az Kartlı** | En az kartı kalan oyunlar önce. | Rozetleri *bitirmek* istiyorsan. |
| **Öncelikli** | Satır oklarıyla kurduğun elle sıra. | Belirli oyunlar senin için önemliyse. |
| **Hızlı** | Aşağıya bak. | 2 saatin altında oyunların varsa. |

### Hızlı mod hakkında

Steam bir oyun için kart düşürmeye ancak **toplam oynanma süresi 2 saati geçtikten sonra**
başlar. Hızlı mod bunu iki aşamada halleder:

1. **Isıtma.** 2 saatin altındaki her seçili oyun *paralel* açılır ve eşiğe çekilir. Steam
   eşzamanlı açık her oyuna süre işlediği için bir parti, en geride kalan üyesi kadar
   sürer; toplamları kadar değil.
2. **Döngü.** Eşiği geçtikten sonra hepsi birlikte açık kalır ve öne çıkan oyun 1,5-2
   dakikada bir değişir (rastgeleleştirilmiş, yani sabit bir ritim oluşmaz).

Hızlı modda Başlat'a bastığında SteamEdge kaç oyunun önce ısıtılması gerektiğini söyler.

### Kuyruk kontrolleri

Kuyruktaki her satırda küçük düğmeler var:

- **↑ / ↓** oyunu yukarı veya aşağı taşır (bu, modu Öncelikli'ye çevirir)
- **En Öne Al** başa gönderir
- **✕** kuyruktan tamamen çıkarır

Sıralaman ve çıkardıkların oturumlar arasında hatırlanır. Ne kadar saklanacağı Ayarlar →
Genel → Yedekleme → *Hatırlanan verinin saklama süresi* ile belirlenir.

---

## 2. Oynanma süresi yükselt

**Saat Yükseltici** sekmesi.

1. Soldaki kütüphanede ara ve oyunlara tıklayarak kuyruğa ekle.
2. **Eşzamanlı limiti** ayarla (2 / 8 / 16 / 32 ya da özel).
3. **Yükseltme süresini** ayarla veya Sınırsız seç.
4. **Başlat**'a bas.

Steam, aynı anda açık olan her oyuna süre işler; bilinen üst sınır 32'dir.

### Saat eşitleme

En çok istenen özellik bu. Ayarlar → Saat Yükseltici → **Saatleri eşitle** ile aç.

Diyelim 8, 11 ve 101 saatlik üç oyunun var ve hepsini eşitlemek istiyorsun. SteamEdge bunu
kademeli yapar:

1. 8 saatlik oyun tek başına 11 saate gelene kadar çalışır.
2. İkisi birlikte 101 saate çıkar.
3. Üçü birden oradan devam eder.

Başlamadan önce her kademeyi ve gereken toplam süreyi listeleyen bir onay kutusu çıkar. Bu
toplam günler sürebilir - kabul etmeden önce oku.

Üç hedef seçeneği var:

- **Seçililerin en yükseği** - kuyruğundaki en çok oynanmış oyun hedefi belirler
- **Elle girilen saat** - hedefi sen yazarsın
- **Kütüphanenin en yükseği** - Steam hesabındaki tüm oyunlar arasındaki en yüksek süre

Hedefi zaten geçmiş oyunlara dokunulmaz.

---

## 3. Başarımları yönet

**Başarımlar** sekmesi.

1. Üstteki seçicide bir oyun ara. Yalnızca başarım tutan oyunlar görünür.
2. Listenin yüklenmesini bekle - SteamEdge gerçek açılma durumunu protokolden okur.
3. Herhangi bir başarımın kutucuğuna tıkla ya da **Seçilenleri Aç** / **Seçilenleri
   Kilitle** kullan.

Sağ panel açıklamayı, nadirliği, açılma tarihini ve tüm oyuncuların yüzde kaçında olduğunu
gösterir.

### Toplu açmadan önce bunu oku

- **Güvenli mod** (varsayılan açık) tek tek açar ve her ikisi arasında rastgele bir boşluk
  bırakır. Açık bırak.
- **Açılış aralığı** varsayılan olarak 1 saniyedir. En hızlı seçenek budur. Yüzlerce
  başarımı birkaç dakikada açmak herkese açık profilinde ve başarım geçmişini izleyen
  sitelerde görünür.
- **Açılışları zamana yay** rastgeleliği daha da genişletir; daha doğal görünür ama çok
  daha uzun sürer.
- Bir başarımı geri kilitlemek mümkündür, ancak özgün açılma tarihi kalıcı olarak kaybolur.

Her açılış yerel bir günlüğe yazılır, böylece neyi değiştirdiğini görebilirsin.

---

## 4. Pazarda öğe sat

**Envanter & Pazar** sekmesi.

### Fiyatları getirme

Sekmeyi açtığında SteamEdge fiyatların hemen getirilip getirilmeyeceğini sorar. Steam pazar
isteklerini sınırlar (kabaca 30 saniyede 20 istek), bu yüzden büyük bir envanteri çekmek
zaman alır.

Daha hızlı yol:

1. **Hayır, Sonra** de.
2. Filtrelerini kur - tür, oyun, durum, fiyat aralığı.
3. Araç çubuğundaki **Fiyatları Getir**'e bas.

Yalnızca o anki filtreye uyan öğeler çekilir. Düğme kilitlenir ve tüm istekler bitene kadar
ilerlemeyi gösterir, sonra açılır. Filtreyi değiştirirsen yeni seçim için tekrar aktif olur.

### Bir öğeyi okumak

Herhangi bir öğeye tıkla. Sağ panelde üç ayrı kutu var ve aradaki fark önemli:

| Kutu | Anlamı |
|---|---|
| **Satıştaki İlanlar** | Satıcıların *istediği* fiyat. Bağlayıcı değil - biri tek parçayı 999.999 dolara koyabilir. |
| **Hemen Sat** | Bekleyen en yüksek alım talimatı. Şu an, bugün eline geçecek olan budur. |
| **Gerçekleşen Satışlar** | Öğenin gerçekten kaça satıldığı. **Değer buradan gelir.** |

Değer, gerçekleşmiş satışların adetle ağırlıklı medyanıdır; ortalaması değil. 100 adet 0,30
dolardan, bir adet 50 dolardan satıldıysa ortalama 0,79 der, medyan 0,30 der. Doğru olan
medyandır.

Bekleyen alım talimatı yoksa **Hemen Sat** kutusu boş kalmaz - son gerçekleşen satışa düşer
ve bunu açıkça yazar.

### Satış

Tek öğe de olsa elli öğe de olsa tüm satış işlemleri alt bardan yapılır.

1. Satmak istediğin öğeleri işaretle (ya da bir satıra tıklayıp doğrudan alt barı kullan).
2. Bir fiyatlandırma stratejisi seç:
   - **Ortalamadan** - gerçekleşmiş satış değeri. En çok kazandırır, en yavaş satar.
   - **Altına in** - en ucuz ilanın bir tık altı. En hızlı satar.
   - **En ucuzla aynı** - en ucuz ilanla aynı fiyat.
   - **Hemen sat** - en yüksek alım talimatına. Anında gider.
   - **Kendim** - fiyatı sen yazarsın.
3. Uyarı satırını kontrol et. Herhangi bir öğe gerçek piyasa değerinin %25 üstünde veya
   altındaysa SteamEdge bunu sen onaylamadan önce söyler.
4. **Sat**'a bas.

Çubuk hem **brüt fiyatı** (alıcının ödediği, Steam'de gördüğün sayı) hem de **net fiyatı**
(Steam'in ~%13 kesintisinden sonra cüzdanına ulaşan) gösterir.

> Hesabında mobil doğrulayıcı varsa Steam her ilanı yine de Steam uygulamasından onaylamanı
> ister. maFile içe aktarmadıysan SteamEdge senin adına otomatik onay vermez.

---

## İşe yarayan alışkanlıklar

- **Önce Genel Bakış'a bak.** Neyin çalıştığını, oturumun ne kadardır sürdüğünü ve tüm
  özelliklerdeki son hareketleri gösterir.
- **Çevrimdışı görün** ayarını aç (Ayarlar → Gizlilik), arkadaşların seni kırk oyun
  "oynarken" görmesini istemiyorsan.
- **Sessiz saatler** kullan (Ayarlar → Bildirimler), uygulama gece üçte seni uyandırmasın.
- **Ayarlarını ara sıra dışa aktar** (Ayarlar → Genel → Yedekleme). Dışa aktarımda giriş
  bilgisi bulunmaz, bu yüzden bulutta tutmak güvenlidir.

---

Sıradaki: [Ayarlar](./INSTRUCTIONS.md) - her ayarın açıklaması.
