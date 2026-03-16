<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# claude.md - Diş Hekimliği Demo Sitesi Projesi

Bu dosya, Claude AI ile Avada WordPress teması kullanarak bir diş hekimliği demo websitesi oluşturma sürecini adım adım tanımlar. Amaç, profesyonel bir demo siteyi hızlıca kurup diş hekimlerine portföy olarak sunmak ve freelance website işleri almak. Son aşamada 21st.dev modern componentleri entegre edeceğiz.[^1_1][^1_2]

## Proje Hedefleri

- Avada'nın "Dentist" prebuilt template'ini temel al (https://avada.website/dentist/).[^1_3][^1_1]
- Demo site: Hizmetler, randevu formu, galeri, blog, hasta yorumları içerecek.
- Kanıt niteliğinde: Responsive, SEO uyumlu, hızlı yüklenen site.
- Final: 21st.dev ile modern UI componentleri (ör. appointment scheduler, testimonial carousel) ekle.


## Gerekli Araçlar ve Kurulum

1. WordPress (yerel: Local by Flywheel veya XAMPP; canlı: Hosting + Domain).
2. Avada Theme lisansı (ThemeForest'ten al, child theme kullan).[^1_4]
3. Önerilen eklentiler: Fusion Core (Avada bundled), Contact Form 7 (randevu), WPForms.[^1_1]
4. 21st.dev hesabı (son aşama için React/Vue component library). (Not: 21st.dev spesifik docs araştır, muhtemelen Next.js tabanlı.)[^1_1]

## Adım Adım İnşa Süreci (Claude ile)

### 1. Temel Kurulum (Claude Prompt: "WordPress + Avada kur")

```
Claude'a sor: "Local WordPress kur, Avada yükle, child theme oluştur ve Dentist demo'yu one-click import et. Child theme style.css ve functions.php kodu ver."
```

- Child theme oluştur: `/wp-content/themes/avada-child/` klasörü.[^1_4]
- style.css header:

```
/*
Theme Name: Avada Child
Template: Avada
*/
@import url("../Avada/style.css");
```

- functions.php:

```php
<?php
function avada_child_enqueue_styles() {
    wp_enqueue_style('avada-parent-styles', get_template_directory_uri() . '/style.css');
}
add_action('wp_enqueue_scripts', 'avada_child_enqueue_styles');
?>
```

- Demo import: Avada > Prebuilt Websites > Dentist > Import.[^1_1]


### 2. Demo İçerik Özelleştir (Claude Prompt: "Avada Dentist template customize et")

```
Claude'a sor: "Avada Dentist demo'sunda şu değişiklikleri yap: Türkçe'ye çevir, fake diş hekimi verileri ekle (Dr. Ahmet Yılmaz, İstanbul), hizmetler: Diş Beyazlatma, İmplant, Ortodonti. Hero section güncelle."
```

- Ana sayfalar: Home (hero + CTA), Services, About, Team, Testimonials, Contact, Blog.[^1_1]
- Fusion Builder ile edit: Container > Column > Elements (Title, Text, Button, Image).[^1_1]
- Renk paleti: Mavi-tonlar (güven verici).[^1_1]
- Performans: Avada Performance Wizard çalıştır (Critical CSS generate et).[^1_1]


### 3. Gelişmiş Özellikler Ekle (Claude Prompt: "Diş sitesi için form ve galeri ekle")

```
Claude'a sor: "Avada'da online randevu formu (Contact Form 7), before-after galeri (Fusion Gallery), hasta yorumları slider ekle. Kod snippet'leri ver."
```

- Randevu sayfası: Button > Form element.
- Galeri: Before/After photos için Portfolio post type kullan.[^1_1]
- SEO: Yoast SEO eklentisi, meta descriptions ekle.


### 4. Test ve Optimize (Claude Prompt: "Siteyi test et")

```
Claude'a sor: "Responsive test, hız optimizasyonu (GTmetrix), mobil uyum için Avada ayarları."
```

- Core Web Vitals optimize.[^1_1]


### 5. 21st.dev Entegrasyonu (Final Aşama)

```
Claude'a sor: "Avada sitesine 21st.dev component embed et. Ör: Headless CMS ile Next.js frontend, veya iframe/shortcode ile component ekle. Örnek kod: Appointment scheduler."
```

- Yaklaşık: Custom post type ile JSON API, 21st.dev'den React component fetch et.
- Alternatif: Avada Layout'a HTML/JS block ekle (Gutenberg/Fusion).


## Sunum ve Satış Stratejisi

- Demo linki paylaş: "Bu demo'yu 2 günde yaptım, sizin için özelleştireyim."
- Fiyatlandırma: 500-1500\$ / site (TR pazarı için).
- Portfolio: Siteyi GitHub Pages veya Netlify'ye deploy et (static export?).


## Potansiyel Sorunlar ve Çözümler

| Sorun | Çözüm |
| :-- | :-- |
| Avada lisansı | ThemeForest'ten tek site license al (69\$). [^1_5] |
| Türkçe çeviri | Loco Translate eklentisi. |
| Hız sorunu | Images optimize (Smush), cache (WP Rocket). [^1_1] |
| 21st.dev uyum | Headless WordPress (WPGraphQL) kullan. |

Claude prompt'larını kopyala-yapıştır yaparak ilerle. Her adımdan sonra screenshot al, bana göster! Tamamlandığında canlı deploy için rehber iste.[^1_2][^1_1]
<span style="display:none">[^1_10][^1_11][^1_12][^1_13][^1_14][^1_15][^1_6][^1_7][^1_8][^1_9]</span>

<div align="center">⁂</div>

[^1_1]: https://avada.website/dentist/

[^1_2]: https://avada.com/blog/avada-dentist-deconstructing-a-prebuilt-website/

[^1_3]: https://avada.com

[^1_4]: https://avada.com/documentation/avada-child-theme/

[^1_5]: https://themeforest.net/item/avada-responsive-multipurpose-theme/2833226

[^1_6]: https://wpastra.com/themes/dentist-wordpress-themes/

[^1_7]: https://wordpress.org/themes/dentistry-clinic/

[^1_8]: https://www.holickycorporation.com/blog/top-dental-website-templates-for-your-practice-online/

[^1_9]: https://avada.com/blog/the-15-best-health-and-beauty-avada-websites-for-wordpress/

[^1_10]: https://awaikenthemes.com/dentaire-dentist-dental-clinic-wordpress-theme/

[^1_11]: https://bigapplemedia.com/top-dental-website-templates-examples/

[^1_12]: https://www.ilovewp.com/resources/medical/wordpress-for-dentists/most-popular-wordpress-themes-for-dentists/

[^1_13]: https://www.youtube.com/watch?v=t_Qu90jt3bg

[^1_14]: https://www.themezaa.com/blog/best-dentist-wordpress-themes-to-create-stunning-dental-websites/

[^1_15]: https://smartslider.helpscoutdocs.com/article/1820-avada-child-theme


---

# Avada linkini şunla güncelle : https://avada.website/dentist/

claude.md içindeki tüm Avada Dentist linklerini şu URL ile kullanabilirsin: `https://avada.website/dentist/`.[^2_1]

Aşağıya, linki güncellenmiş haliyle sadeleştirilmiş bir claude.md versiyonu koyuyorum; istersen bir sonraki adımda daha da özelleştirebiliriz.

***

# claude.md – Diş Hekimliği Demo Sitesi (Avada)

Bu dosya, Claude ile Avada Dentist prebuilt template kullanarak diş hekimliği demo websitesi üretmek için prompt ve teknik notları içerir.[^2_2][^2_1]

## Hedef

- Avada Dentist demo: https://avada.website/dentist/ adresini temel al.[^2_1]
- Demo sitede: Hizmetler, randevu formu, önce/sonra galeri, yorumlar, blog olsun.[^2_3][^2_2]
- Bunu portföy olarak diş hekimlerine sun, finalde 21st.dev componentleri ekle.


## Kurulum Adımları (WordPress + Avada)

1. Local veya hosting üzerinde boş WordPress kur.
2. Avada temasını ve gerekli pluginleri yükle, lisansı aktif et.[^2_4][^2_3]
3. Avada Setup Wizard ile **Avada Dentist** prebuilt site’i seç ve tek tıkla import et.[^2_5][^2_2][^2_1]

Claude’a prompt:

```text
WordPress üzerinde Avada yüklü. Bana Avada Dentist demo'yu (https://avada.website/dentist/) import etmek için adımları ve olası hatalar için çözümleri kısa maddelerle yaz.
```


## Özelleştirme Akışı

Claude’a içerik üretmek için:

1. Klinik kimliği:
```text
Diş kliniği için kurgu bilgiler üret:
- İsim: Dentica Ağız ve Diş Sağlığı
- Doktor: Uzm. Dr. Ahmet Yılmaz
- Konum: Kadıköy, İstanbul
- Hedef kitle: Orta-üst gelir, estetik odaklı
Bu bilgilere göre hero başlık, alt başlık ve CTA buton metni yaz.
```

2. Hizmet sayfaları:
```text
Avada Dentist demo yapısına uygun, şu hizmetler için ayrı sayfa metinleri üret:
- Diş Beyazlatma
- İmplant Tedavisi
- Ortodonti (Telsiz şeffaf plak)
Her sayfa için: kısa giriş, 3 madde avantaj, 3 SSS (soru-cevap).
```

3. Yorumlar ve önce/sonra:
```text
Estetik diş hekimliği hastaları için 5 adet gerçekçi hasta yorumu yaz. 
Her biri: isim kısaltması, yaş, kısa öykü, sonuç hissi.
Ayrıca 3 adet "önce/sonra" vaka açıklaması üret (metinsel).
```

4. Randevu formu metinleri:
```text
Online randevu formu için:
- Form başlığı
- Kısa açıklama
- Alan etiketleri (Ad Soyad, Telefon, E-posta, Tercih edilen tarih/saat, Mesaj)
- Gönderim sonrası teşekkür metni
yaz.
```

Bu metinleri Avada’nın sayfalarına, Fusion Builder üzerinden blok blok yerleştir.

## Tasarım ve Performans

- Renk paleti: Mavi, beyaz, açık gri; güven ve hijyen vurgusu.[^2_2]
- Avada Performance ayarlarından CSS/JS optimizasyonlarını ve lazy-load’u aç.[^2_2]
- Görselleri yüklemeden önce sıkıştır (TinyPNG vb.).[^2_3]

Claude’a optimizasyon prompt’u:

```text
Avada Dentist demo kullanan bir diş hekimliği sitesi için PageSpeed puanını yükseltmek amacıyla,
WordPress ve Avada özelinde uygulanacak 10 maddelik optimizasyon listesi üret.
```


## 21st.dev Entegrasyon Planı

(Önce demo bittiğinde kullan.)

- Strateji: Avada içindeki belirli alanlarda 21st.dev ile ürettiğin React/JS componentleri shortcode veya script embed ile kullan.
- Örnek component fikirleri:
    - Dinamik randevu takvimi
    - Interactive fiyat hesaplayıcı
    - Testimonial carousel / slider

Claude’a entegrasyon prompt örneği:

```text
WordPress + Avada Dentist temasında, 21st.dev ile geliştirilmiş bir randevu takvimi React componentini
tek bir sayfaya gömmek için örnek HTML + JS snippet üret. 
Varsay: component global bir CDN üzerinden window.AppointmentWidget ile geliyor.
```


## Sunumda Kullanacağın Hikâye

- “Bu demo’yu hazır Avada Dentist altyapısı üzerinde, size özel içerik ve tasarım uyarlamasıyla 3–5 gün içinde yayına alabiliyorum.”[^2_1][^2_3]
- “Daha sonra isterseniz 21st.dev ile özel componentler (takvim, fiyat hesaplayıcı, animasyonlu grafikler) ekleyerek kliniğinizi rakiplerden ayırabiliriz.”

Bir sonraki adımda istersen, tüm bu claude.md’yi senin workflow’una (ör. n8n → Claude otomasyon) daha uygun bir yapıya dönüştürebilirim; demo için öncelikle içerik tonunu mu yoksa teknik setup’ı mı netleştirmek istersin?
<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_6][^2_7][^2_8][^2_9]</span>

<div align="center">⁂</div>

[^2_1]: https://avada.website/dentist/

[^2_2]: https://avada.com/blog/avada-dentist-deconstructing-a-prebuilt-website/

[^2_3]: https://www.holickycorporation.com/blog/top-dental-website-templates-for-your-practice-online/

[^2_4]: https://avada.com

[^2_5]: https://avada.com/documentation/avada-prebuilt-websites/

[^2_6]: https://avada.com/prebuilt-websites/

[^2_7]: https://avada.com/blog/the-15-best-health-and-beauty-avada-websites-for-wordpress/

[^2_8]: https://avada.website

[^2_9]: https://avada.website/dentist/treatments/

[^2_10]: https://www.youtube.com/watch?v=piL3nFtPK0k

[^2_11]: https://bigapplemedia.com/top-dental-website-templates-examples/

[^2_12]: https://www.youtube.com/watch?v=DzLeX8q3850

[^2_13]: https://www.youtube.com/watch?v=tvEgo5oZVxY


---

# bilgileri md dosyası olarak ver

Aşağıyı direkt `claude.md` dosyası olarak kaydedebilirsin:

```markdown
# Diş Hekimliği Demo Sitesi – Avada Dentist (Claude Çalışma Dosyası)

Bu dosya, Claude ile Avada Dentist prebuilt template kullanarak diş hekimliği demo websitesi üretmek için prompt ve teknik notları içerir.[web:1][web:3]

---

## 1. Proje Özeti

- Tema: Avada Website Builder (WordPress premium tema).[web:2][web:4]  
- Demo: Avada Dentist prebuilt website → https://avada.website/dentist/[web:1]  
- Amaç: Diş hekimlerine gösterebileceğin, profesyonel görünümlü, hızlıca uyarlanabilir bir demo site oluşturmak.  
- Son adım: 21st.dev üzerinden modern componentler (takvim, hesaplayıcı, testimonial slider vb.) embed etmek.

---

## 2. Kurulum Akışı (WordPress + Avada)

### 2.1. WordPress ve Avada

1. Local (LocalWP, XAMPP) ya da hosting üzerinde boş bir WordPress kur.
2. Avada temasını yükle ve lisansı aktif et (Envato / ThemeForest satın alımı gerekli).[web:2][web:4]  
3. Gerekli Avada eklentilerini (Fusion Builder vb.) etkinleştir.[web:25]  

Claude prompt:
```text
WordPress üzerinde Avada temasını kullanıyorum. Bana:
- Temayı yükleme ve lisanslama
- Gerekli Avada pluginlerini kurma
- Temel güvenlik ve genel ayarları yapma
için maddeler halinde kısa bir teknik checklist yaz.
```


### 2.2. Avada Dentist Demo’yu İçe Aktarma

1. Avada panelinden: Avada > Websites / Prebuilt Websites menüsüne git.[web:16][web:20]
2. Arama kısmında “Dentist” demo’sunu bul (ön izlemesi https://avada.website/dentist/).[web:1][web:3]
3. “Import” butonu ile tam site içe aktarma (sayfalar, menüler, demo görseller, ayarlar).[web:3][web:20]

Claude prompt:

```text
Avada Dentist prebuilt website'i (https://avada.website/dentist/) tek tıkla import ederken dikkat edilmesi gerekenler,
sık görülen hata mesajları ve bunların çözümlerini maddeler halinde yaz.
```


---

## 3. Site Yapısı ve Sayfalar

Avada Dentist demo tipik olarak şu sayfaları içeriyor:[web:1][web:3][web:18][web:27]

- Home (Ana Sayfa)
- About (Hakkımızda)
- Treatments / Services (Tedaviler / Hizmetler)
- Testimonials (Yorumlar)
- Contact (İletişim / Randevu)
- Blog (Opsiyonel)

Bu yapıyı demo diş kliniği için Türkçeleştirip özelleştireceksin.

Claude prompt:

```text
Kurgusal bir diş kliniği için aşağıdaki bilgileri kullan:
- Klinik Adı: Dentica Ağız ve Diş Sağlığı
- Doktor: Uzm. Dr. Ahmet Yılmaz
- Konum: Kadıköy, İstanbul
- Hedef kitle: Estetik odaklı, orta-üst gelir grubu

Avada Dentist demo yapısına uygun olarak:
- Ana sayfa hero başlığı, alt başlığı ve CTA metni
- Kısa bir 'Hakkımızda' paragrafı
- 3 ana tedavi kategorisi için kısa açıklamalar
yaz.
```


---

## 4. İçerik Üretimi (Hizmetler, Yorumlar, SSS)

### 4.1. Hizmet Sayfaları

Her hizmet için ayrı bir sayfa (veya aynı sayfada bölüm) kullanabilirsin:[web:1][web:3][web:18]

Örnek hizmetler:

- Diş Beyazlatma
- İmplant Tedavisi
- Ortodonti (Şeffaf plaklar)
- Estetik Dolgu

Claude prompt:

```text
Aşağıdaki hizmetler için Avada Dentist tarzına uygun içerik üret:
- Diş Beyazlatma
- İmplant Tedavisi
- Ortodonti (Şeffaf plaklar)

Her hizmet için:
- 2–3 cümlelik giriş paragrafı
- 3 maddelik avantaj listesi
- 3 adet SSS (soru + kısa cevap)
yaz. Dil: Türkçe, hasta dostu, güven verici.
```


### 4.2. Hasta Yorumları (Testimonials)

Demo için gerçekçi ama kurgusal yorumlar:[web:1][web:3]

Claude prompt:

```text
Diş estetiği üzerine çalışan bir klinik için 5 adet kurgusal hasta yorumu üret.
Her yorum için:
- İsim ve soyadın sadece baş harfi (örn. Ayşe K.)
- Yaş
- Kısa problem açıklaması
- Tedavi sonrası his ve sonuç
yaz. Ton: samimi, güven verici.
```


### 4.3. Önce / Sonra Vaka Metinleri

Görselleri sonradan ekleyebilirsin; önce metinsel vaka açıklamaları üret:[web:1][web:3]

Claude prompt:

```text
Diş beyazlatma ve lamina tedavisi için 3 adet 'önce/sonra vaka' metni yaz.
Her vaka için:
- İlk durum (şikayet)
- Uygulanan tedavi
- Sonuç (hasta açısından)
2–3 cümle ile özetle.
```


---

## 5. Tasarım, Renkler ve Performans

### 5.1. Avada Dentist Tasarım Mantığı

Avada Dentist, monokromatik bir renk paleti ve sade layout yapısı kullanıyor:[web:3]

- Renk paleti: Temiz mavi tonları, beyaz ve açık gri.
- Hero bölümünde arka plan görseli + başlık, alt başlık, CTA buton.
- Tedavi bölümlerinde iki sütunlu layout ve checklist elementleri.

Claude prompt:

```text
Diş hekimliği web sitesi için:
- Birincil renk (hex), ikincil renk, aksan rengi
- Buton stilleri (primary/secondary)
- Hero alanı için kısa stil tarifi
öner. Avada Dentist tarzına yakın olsun.
```


### 5.2. Performans Optimizasyonu

Avada, Performance Wizard ile optimizasyon adımlarını yönlendiriyor:[web:3]

Yapılacaklar:

- Site yapısı ve içerik bittikten sonra Performance Wizard’ı çalıştır.
- Lazy-load, minify, combine ayarlarını test ederek etkinleştir.
- Görselleri yüklemeden önce sıkıştır (TinyPNG vb.).[web:6]

Claude prompt:

```text
Avada Dentist demosu üzerine kurulu bir diş kliniği sitesinin
Google PageSpeed skorunu artırmak için:
- Avada özelinde 5
- WordPress genelinde 5
optimizasyon maddesi yaz.
```


---

## 6. 21st.dev Entegrasyonu (Son Aşama)

Bu adım, WordPress + Avada üzerinde çalışan siteye modern componentler eklemek için kullanılacak.

Örnek component fikirleri:

- Online randevu takvimi (takvim + zaman seçimi)
- Dinamik fiyat hesaplayıcı (implant, beyazlatma paketleri)
- Testimonial slider / image carousel (Avada Image Carousel ile hibrit veya tamamen custom).[web:26]

Claude prompt (generic entegrasyon):

```text
WordPress + Avada Dentist tabanlı bir sitede, 21st.dev ile üretilmiş bir React randevu widget'ını
tek sayfaya eklemek istiyorum.

Varsayımlar:
- Widget global bir script ile window.AppointmentWidget altında expose ediliyor.
- WordPress'te bu scripti enqueue edebiliyorum.
Bana:
1) functions.php içine eklenecek örnek wp_enqueue_script kodu
2) Sayfa içi HTML'de kullanacağım <div> ve init script
örneği ver.
```


---

## 7. Diş Hekimlerine Sunum Notları

- “Bu demo, Avada Dentist altyapısı ile kuruldu. Sizin logonuz, renkleriniz, metinleriniz ve fotoğraflarınızla 3–5 gün içinde yayına alabilirim.”[web:1][web:3][web:4]
- “İsterseniz daha ileri seviyede, 21st.dev ile kişisel randevu takvimi, fiyat hesaplayıcı gibi özel componentler ekleyip sizi rakip kliniklerden ayırabiliriz.”
- “Tüm site mobil uyumlu, SEO dostu ve hız optimizasyonu yapılmış olacak.”[web:3][web:4]

---

## 8. Hızlı Kontrol Listesi

- [ ] WordPress kurulu ve güncel.
- [ ] Avada lisansı aktif, gerekli pluginler kurulu.[web:2][web:4]
- [ ] Avada Dentist demo tamamen import edildi.[web:1][web:3][web:20]
- [ ] Klinik bilgilerine göre Türkçe içerik girildi.
- [ ] Randevu formu, iletişim bilgileri ve harita çalışıyor.[web:18]
- [ ] Performance Wizard sonrası hız testi (GTmetrix, PageSpeed) yapıldı.[web:3]
- [ ] 21st.dev entegrasyonu için placeholder alanlar hazır.

```

Bu md dosyasında eksik gördüğün kısım olursa, hangi bölümü detaylandırmamı istersin: teknik kurulum mu, içerik prompt’ları mı, yoksa 21st.dev entegrasyon senaryosu mu?
<span style="display:none">[^3_1][^3_10][^3_11][^3_12][^3_13][^3_14][^3_15][^3_2][^3_3][^3_4][^3_5][^3_6][^3_7][^3_8][^3_9]</span>

<div align="center">⁂</div>

[^3_1]: https://avada.website/dentist/
[^3_2]: https://avada.com/blog/avada-dentist-deconstructing-a-prebuilt-website/
[^3_3]: https://avada.com/prebuilt-websites/
[^3_4]: https://avada.com
[^3_5]: https://dentalcaddesign.it/tag/avada/
[^3_6]: https://avada.com/blog/the-15-best-health-and-beauty-avada-websites-for-wordpress/
[^3_7]: https://wpastra.com/themes/dentist-wordpress-themes/
[^3_8]: https://www.youtube.com/watch?v=YP5JnHkoArQ
[^3_9]: https://avada.website/dentist/treatments/
[^3_10]: https://avada.com/documentation/
[^3_11]: https://avada.com/element/image-carousel/
[^3_12]: https://avada.com/documentation/avada-prebuilt-websites/
[^3_13]: https://avada.website/dentist/about/
[^3_14]: https://danaparkdental.com/about/
[^3_15]: https://www.youtube.com/watch?v=3ue6x38bbxk

---

# avadayı sadece temasını kullanmak için kullanacağız

Sadece Avada’nın temasını (tasarım / layout / demo içerik) kullanıp, geri kalan mantığı ve componentleri kendin/21st.dev ile kurman gayet mümkün.[^4_1][^4_2]

Aşağıdaki md bloğunu mevcut `claude.md` dosyana ekleyebilir veya önceki versiyondaki “Kurulum” kısmını bununla değiştirebilirsin:

```markdown
## Avada Kullanım Stratejisi (Sadece Tema)

Bu projede Avada’yı tam bir “site builder” olarak değil, hazır tasarım ve demo içeriği sağlayan bir WordPress **teması** olarak kullanacağız.[web:2][web:3]

### Ne yapıyoruz?

- Avada Dentist demo tasarımını ve layout’larını kullanıyoruz (header, footer, section yapısı, typography, renkler).[web:1][web:3]  
- Sayfa içi dinamik mantık, özel componentler, ileri seviye formlar ve etkileşimleri **21st.dev ve kendi kodumuzla** çözüyoruz.  
- Avada Builder’ı minimum seviyede kullanıp, sadece şu amaçlarla dokunuyoruz:
  - Var olan layout bloklarını silmek/taşımak
  - Placeholder text/görselleri içeriklerle değiştirmek
  - Gerekirse boş “HTML / Code Block” alanları açmak

### Ne yapmıyoruz?

- Avada’yı “her şeyi Avada ile yapalım” kafasıyla kullanmıyoruz.[web:30][web:33]  
- Karmaşık form, hesaplayıcı, interaktif widget gibi şeyleri Avada elementleriyle çözmeye çalışmıyoruz; bunlar 21st.dev tarafında component olarak üretilecek.  
- Çok ağır builder özelliklerine abanıp siteyi şişirmiyoruz; tasarımı alıp, davranışı kendi stack’imizle kurguluyoruz.[web:32][web:35]  

### Teknik Not

- Avada Dentist demo’yu yine de bir kez full import edeceğiz, çünkü:
  - Header/Footer ve genel style guide hazır gelsin.
  - Sayfaların section hiyerarşisini görmek, kendi component’lerimizi nereye gömeceğimizi anlamak daha kolay olsun.[web:3][web:20]  
- İleride istersen:
  - Avada’yı sadece bir “starter theme” gibi kullanıp
  - Kısmî/total headless senaryoya (WP + 21st.dev frontend) geçebilirsin.

```

İstersen sıradaki adımda, bu yaklaşıma göre “sadece tema + 21st.dev componentler” odaklı daha net bir sayfa yapısı (hangi alana hangi component gelecek) şeması da çıkarabilirim; böyle bir şema ister misin?
<span style="display:none">[^4_10][^4_11][^4_12][^4_13][^4_14][^4_15][^4_3][^4_4][^4_5][^4_6][^4_7][^4_8][^4_9]</span>

<div align="center">⁂</div>

[^4_1]: https://avada.com/blog/avada-dentist-deconstructing-a-prebuilt-website/

[^4_2]: https://avada.com

[^4_3]: https://avada.com/features/

[^4_4]: https://avada.com/documentation/requirements-for-avada/

[^4_5]: https://dev.to/gorden_liu_82ef393853e7bf/a-complete-guide-to-customizing-avada-theme-features-using-2h8h

[^4_6]: https://avada.com/documentation/whats-included-with-your-avada-purchase/

[^4_7]: https://www.wordpressintegration.com/blog/avada-wordpress-theme-guide/

[^4_8]: https://www.wpsolr.com/install-setup-avada-theme-website/

[^4_9]: https://supporthost.com/avada-wordpress-theme-review/

[^4_10]: https://avada.com/documentation/avada-quick-start-guide/

[^4_11]: https://avada.com/blog/4-key-benefits-of-using-a-premium-wordpress-theme/

[^4_12]: https://avada.com/blog/avada-dispensary-deconstructing-a-prebuilt-website/

[^4_13]: https://www.reddit.com/r/Wordpress/comments/1mwed8f/avada_theme_in_wordpress/

[^4_14]: https://avada.com/documentation/how-the-avada-builder-works/

[^4_15]: https://avada.com/blog/avada-festival-deconstructing-a-prebuilt-website/


---
