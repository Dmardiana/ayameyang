-- ============================================
-- AyamEyang Restaurant Seed Data
-- Run after init-db.sql
-- ============================================

-- ============================================
-- USERS (password: admin / customer) - bcrypt hashed
-- admin   -> $2b$10$WxeUmFv5ywZAp7J0WTB/3.0Qg1b.96JXqlbZ0s42daeZsImkD6iHy
-- customer -> $2b$10$OTVoBW32oXPV1wSgo95cLOBHZw.Ap8Gh3ScduH2P5Ys/jLWE8H2/O
-- ============================================
INSERT INTO users (id, email, name, role, phone, address, password_hash, created_at) VALUES
('usr_admin', 'admin@ayameyang.com', 'Eyang Admin', 'admin', '08123456789', 'Jalan Kaliurang KM 5, Sleman, Yogyakarta', '$2b$10$WxeUmFv5ywZAp7J0WTB/3.0Qg1b.96JXqlbZ0s42daeZsImkD6iHy', '2026-01-01T12:00:00Z'),
('usr_customer', 'customer@ayameyang.com', 'Budi Santoso', 'customer', '08987654321', 'Jalan Malioboro No. 42, Yogyakarta', '$2b$10$OTVoBW32oXPV1wSgo95cLOBHZw.Ap8Gh3ScduH2P5Ys/jLWE8H2/O', '2026-02-01T14:30:00Z');

-- ============================================
-- MENU ITEMS (35 items: 20 makanan, 10 minuman, 5 dessert)
-- ============================================
INSERT INTO menu_items (id, name, description, price, category, image, is_available, rating, sold_count) VALUES
-- MAKANAN
('mn_1', 'Ayam Goreng Kremes Eyang', 'Ayam goreng renyah bumbu kuning khas warisan Eyang dengan taburan kremesan super garing, disajikan lengkap dengan sambal terasi dan lalapan segar.', 32000, 'makanan', 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800', true, 4.9, 450),
('mn_2', 'Ayam Bakar Bumbu Rujak', 'Ayam bakar yang diungkep bumbu rujak pedas manis gurih, dibakar di atas arang kelapa hingga harum meresap ke dalam serat daging.', 34000, 'makanan', 'https://images.unsplash.com/photo-1598515213692-5f252f75d785?q=80&w=800', true, 4.8, 380),
('mn_3', 'Ayam Geprek Sambal Korek', 'Ayam goreng tepung renyah berpadu gurih pedasnya sambal korek bawang segar yang disiram minyak kelapa panas. Pedasnya juara!', 25000, 'makanan', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800', true, 4.7, 520),
('mn_4', 'Sate Ayam Madura', '10 tusuk sate ayam empuk legendaris disiram saus kacang kental yang gurih legit, taburan bawang goreng harum, dan irisan jeruk limau.', 28000, 'makanan', 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800', true, 4.8, 290),
('mn_5', 'Soto Ayam Lamongan', 'Soto ayam berkuah kuning hangat dengan bumbu koya gurih melimpah, soun lembut, tauge, irisan kol, dan telur rebus.', 24000, 'makanan', 'https://images.unsplash.com/photo-1547496502-afe22d43cfab?q=80&w=800', true, 4.6, 210),
('mn_6', 'Rendang Daging Sapi Eyang', 'Daging sapi pilihan yang dimasak perlahan selama belasan jam dengan santan kental dan rempah-rempah asli Nusantara hingga empuk berkaramel.', 45000, 'makanan', 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800', true, 4.9, 340),
('mn_7', 'Nasi Goreng Spesial Eyang', 'Nasi goreng harum wajan besi bumbu kampung dengan suwiran ayam, telur mata sapi, bakso sapi, sosis, dan kerupuk udang renyah.', 26000, 'makanan', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800', true, 4.7, 410),
('mn_8', 'Mie Goreng Jawa Nyemek', 'Mie telur tebal dimasak dengan kaldu ayam, kol, sawi hijau, suwiran ayam kampung, telur orak-arik, disajikan sedikit basah (nyemek) beraroma asap.', 25000, 'makanan', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800', true, 4.6, 310),
('mn_9', 'Ayam Betutu Gilimanuk', 'Ayam utuh yang dibalur dengan bumbu genep Bali yang pekat nan kaya rempah, dikukus lalu dipanggang lambat hingga merata lembutnya.', 36000, 'makanan', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800', true, 4.8, 150),
('mn_10', 'Ayam Taliwang Lombok', 'Ayam kampung bakar khas Lombok bercita rasa ekstra pedas gurih dengan bumbu cabai merah dan terasi bakar yang merona menggoda.', 38000, 'makanan', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800', true, 4.7, 190),
('mn_11', 'Ayam Pop khas Minang', 'Ayam kampung tanpa kulit yang direbus bumbu air kelapa dan bawang, digoreng kilat dalam minyak panas, disajikan dengan sambal merah gurih.', 33000, 'makanan', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800', true, 4.8, 175),
('mn_12', 'Sup Buntut Sapi Rempah', 'Kuah kaldu sapi bening gurih bertabur rempah aromatik, potongan buntut sapi empuk, wortel, kentang, daun bawang seledri, dan sambal hijau.', 48000, 'makanan', 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800', true, 4.9, 220),
('mn_13', 'Bakso Sapi Kuah Eyang', '5 butir bakso sapi urat jumbo super kenyal berdampingan tahu bakso gurih di dalam kuah kaldu sumsum sapi pekat bertabur seledri.', 24000, 'makanan', 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?q=80&w=800', true, 4.7, 300),
('mn_14', 'Gado-Gado Siram Pengantin', 'Sayur-sayuran segar rebus, tempe, tahu, telur rebus, kentang, disiram bumbu kacang halus bertekstur legit, ditutup emping dan kerupuk bawang.', 22000, 'makanan', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800', true, 4.6, 140),
('mn_15', 'Tumis Cah Kangkung Terasi', 'Kangkung sawah segar renyah ditumis cepat dengan api besar bersama terasi udang premium, bawang putih, bawang merah, dan cabai iris.', 15000, 'makanan', 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800', true, 4.5, 260),
('mn_16', 'Tempe Mendoan Anget', '5 lembar tempe lebar berbalur tepung adonan daun bawang melimpah, digoreng setengah matang khas Banyumasan, lengkap dengan kecap rawit pedas.', 12000, 'makanan', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800', true, 4.8, 480),
('mn_17', 'Tahu Kipas Udang Crispy', '3 pcs tahu pong besar berisi tumisan sayuran wortel kol, bakso, udang cincang gurih, digoreng kering berbalut adonan tepung crispy renyah.', 18000, 'makanan', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800', true, 4.7, 190),
('mn_18', 'Perkedel Jagung Manis', '3 buah perkedel jagung manis renyah pipil yang harum ketumbar dan irisan daun jeruk seledri, digoreng kuning keemasan.', 12000, 'makanan', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800', true, 4.6, 230),
('mn_19', 'Sambal Terasi Ulek Eyang', 'Sambal ulek segar khas Eyang menggunakan cabai rawit merah, tomat matang, terasi bakar Juwana premium, dan perasan jeruk purut.', 5000, 'makanan', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800', true, 4.9, 610),
('mn_20', 'Sambal Hijau Padang Pedes', 'Sambal ulek kasar cabai hijau segar, tomat hijau, bawang merah, ditumis gurih harum dengan minyak kelapa asli.', 5000, 'makanan', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800', true, 4.6, 325),
-- MINUMAN
('mn_21', 'Es Teh Manis Selasih', 'Seduhan teh melati wangi khas Solo dengan gula cair murni, disajikan dingin segar berpadu dengan butiran selasih.', 6000, 'minuman', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800', true, 4.8, 750),
('mn_22', 'Es Jeruk Peras Murni', 'Jeruk peras Pontianak segar pilihan kaya vitamin C murni tanpa campuran perisa buatan, disajikan dingin membangkitkan dahaga.', 10000, 'minuman', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800', true, 4.7, 450),
('mn_23', 'Es Kelapa Muda Jeruk', 'Daging kelapa muda serut lembut disajikan di dalam gelas tinggi berisi air kelapa asli, perasan jeruk manis, dan es batu segar.', 15000, 'minuman', 'https://images.unsplash.com/photo-1525385133336-25484724c23c?q=80&w=800', true, 4.8, 330),
('mn_24', 'Jus Alpukat Kerok Coklat', 'Buah alpukat mentega segar kental diblender halus dengan pemanis alami, disajikan dengan coretan susu kental manis coklat melingkar.', 14000, 'minuman', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800', true, 4.6, 220),
('mn_25', 'Jus Mangga Manis Arumanis', 'Mangga Arumanis matang pohon diblender kental lembut menyegarkan tenggorokan Anda di siang hari.', 14000, 'minuman', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=800', true, 4.7, 190),
('mn_26', 'Wedang Jahe Sereh Anget', 'Minuman hangat tradisional hasil rebusan jahe merah bakar geprek, sereh wangi, dan pemanis gula merah tebu alami.', 10000, 'minuman', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800', true, 4.8, 120),
('mn_27', 'Es Campur Segar Legendaris', 'Kolang-kaling empuk, cincau hitam, pacar cina, alpukat, kelapa serut, buah nangka harum disiram sirup merah cap bangau dan susu kental manis.', 16000, 'minuman', 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=800', true, 4.9, 280),
('mn_28', 'Es Kopi Susu Aren Pekat', 'Espresso arabika gayo pekat berpadu susu segar gurih creamy dan sirup gula aren asli organik beraroma wangi.', 14000, 'minuman', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800', true, 4.7, 390),
('mn_29', 'Es Teh Tarik Rempah', 'Teh hitam pekat ditarik berbusa melimpah berpadu susu kental manis dan sedikit kapulaga cengkeh harum.', 12000, 'minuman', 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=800', true, 4.8, 160),
('mn_30', 'Es Soda Gembira Ria', 'Minuman soda berkarbonasi dingin yang dicampur dengan susu kental manis putih dan sirup merah frambozen.', 12000, 'minuman', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800', true, 4.6, 200),
-- DESSERT
('mn_31', 'Pisang Goreng Keju Caramel', 'Pisang raja matang digoreng dengan adonan tepung renyah, diberi parutan keju cheddar melimpah dan siraman saus caramel gula jawa.', 18000, 'dessert', 'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?q=80&w=800', true, 4.8, 320),
('mn_32', 'Roti Bakar Coklat Keju Susu', '2 tangkup roti tebal dioles mentega harum, dipanggang kecoklatan dengan isi coklat meises premium dan taburan parutan keju gurih susu kental.', 18000, 'dessert', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800', true, 4.7, 240),
('mn_33', 'Kolak Pisang Campur Hangat', 'Sajian dessert hangat berisi pisang kepok manis, kolang-kaling kenyal, ubi madu dalam kuah kuah santan gula kelapa harum daun pandan.', 15000, 'dessert', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800', true, 4.8, 180),
('mn_34', 'Es Teler Istimewa Durian', 'Es serut lembut bercampur kerokan kelapa muda, nangka harum, alpukat legit, disempurnakan sebutir daging durian Medan manis wangi.', 22000, 'dessert', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800', true, 4.9, 390),
('mn_35', 'Serabi Solo Aneka Rasa', '3 gulung serabi lembut bertekstur legit khas Solo dengan varian rasa original santan gurih, keju, dan coklat meises melimpah.', 16000, 'dessert', 'https://images.unsplash.com/photo-1600613247477-fe1780521e7f?q=80&w=800', true, 4.8, 150);

-- ============================================
-- PROMOS
-- ============================================
INSERT INTO promos (id, title, description, code, discount_percent, banner_url, is_available, min_purchase) VALUES
('pr_1', 'Diskon Spesial AyamEyang 10%', 'Nikmati hidangan ayam legendaris warisan resep Eyang dengan potongan instan 10% untuk semua menu tanpa minimum pembelian.', 'PROMOEYANG10', 10, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800', true, 0),
('pr_2', 'Kenyang Hemat Bareng AyamEyang', 'Makan berdua lebih seru dan hemat! Potongan Rp 25.000 untuk minimal pembelanjaan senilai Rp 100.000 menggunakan kode promo ini.', 'AYAMKENYANG', 15, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800', true, 100000),
('pr_3', 'Kumpul Keluarga Hari Minggu', 'Waktunya makan bersama seluruh keluarga besar di hari Minggu. Dapatkan diskon spesial 20% untuk transaksi minimum Rp 200.000.', 'MINGGUKELUARGA', 20, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', true, 200000),
('pr_4', 'Reservasi Meja VIP Prioritas', 'Pesan meja VIP Anda hari ini untuk pertemuan bisnis atau acara ulang tahun keluarga, dapatkan potongan instan 15% hidangan pembuka.', 'RESERVASIVIP', 15, 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800', true, 150000),
('pr_5', 'Makan Hemat Tengah Bulan', 'Jangan khawatir kantong kering di pertengahan bulan. Dapatkan diskon 12% untuk mengobati selera makan Anda sepuasnya.', 'MAKANHEMAT', 12, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800', true, 75000);

-- ============================================
-- BRANCHES
-- ============================================
INSERT INTO branches (id, name, address, phone, lat, lng, is_main_branch, coming_soon) VALUES
('br_1', 'AyamEyang Cabang Utama Bandung', 'Jalan Gatot Subroto, Karees Kulon No. 11/33, Bandung', '+62 859-5646-5878 / +62 818-0222-2979', -6.926200, 107.636600, true, false),
('br_2', 'AyamEyang Cabang Jakarta', 'Jakarta (Coming Soon)', '-', -6.273600, 106.814300, false, true),
('br_3', 'AyamEyang Cabang Yogyakarta', 'Yogyakarta (Coming Soon)', '-', -7.759200, 110.378900, false, true),
('br_4', 'AyamEyang Cabang Surabaya', 'Surabaya (Coming Soon)', '-', -7.271100, 112.752300, false, true),
('br_5', 'AyamEyang Cabang Solo', 'Solo (Coming Soon)', '-', -7.568400, 110.801200, false, true);

-- ============================================
-- REVIEWS (20 reviews)
-- ============================================
INSERT INTO reviews (id, customer_name, rating, comment, menu_id, menu_name, date) VALUES
('rv_1', 'Siti Rahma', 5, 'Ayam Kremesnya luar biasa renyah dan bumbunya benar-benar gurih sampai ke dalam tulang! Sambal terasinya juara.', 'mn_1', 'Ayam Goreng Kremes Eyang', '2026-06-15'),
('rv_2', 'Doni Setiawan', 5, 'Bumbu rujak di ayam bakarnya benar-benar kaya rempah. Manis, asam, gurih, dan pedasnya pas sekali dengan selera lidah Jawa saya.', 'mn_2', 'Ayam Bakar Bumbu Rujak', '2026-06-18'),
('rv_3', 'Yulia Ningsih', 4, 'Sate ayamnya sangat empuk, saus kacangnya kental, gurih manisnya pas. Anak-anak sangat suka menu sate ini.', 'mn_4', 'Sate Ayam Madura', '2026-06-20'),
('rv_4', 'Rian Hidayat', 5, 'Soto Lamongannya kental akan bumbu koya gurih yang melimpah ruah. Sangat nikmat dimakan hangat-hangat di musim hujan.', 'mn_5', 'Soto Ayam Lamongan', '2026-06-22'),
('rv_5', 'Dewi Lestari', 5, 'Rendang daging sapinya sungguh lembut sekali langsung lumer di mulut. Bumbu karamelnya pekat, hitam eksotis dan sangat wangi.', 'mn_6', 'Rendang Daging Sapi Eyang', '2026-06-23'),
('rv_6', 'Agus Purnomo', 4, 'Nasi goreng kampungnya lezat beraroma wok-hei khas wajan besi panas. Porsinya mengenyangkan, lengkap dengan telur mata sapi.', 'mn_7', 'Nasi Goreng Spesial Eyang', '2026-06-24'),
('rv_7', 'Lina Marlina', 5, 'Ayam Geprek Sambal Koreknya benar-benar pedas meledak tapi bikin nagih terus! Untuk pecinta pedas, ini wajib dicoba.', 'mn_3', 'Ayam Geprek Sambal Korek', '2026-06-25'),
('rv_8', 'Bambang Tri', 5, 'Sangat menyukai Es Campur segarnya! Bahan-bahannya lengkap, buah nangkanya sangat harum dan sirupnya manis murni pas.', 'mn_27', 'Es Campur Segar Legendaris', '2026-06-26'),
('rv_9', 'Wulan Sari', 5, 'Pisang Goreng Keju Caramel adalah penutup yang sempurna. Adonannya kriuk manis, kejunya gurih melimpah di atasnya.', 'mn_31', 'Pisang Goreng Keju Caramel', '2026-06-27'),
('rv_10', 'Fajar Shidiq', 4, 'Es Kopi Susu Arennya memiliki kombinasi pahit kopi gayo dan legit gula aren yang sangat serasi. Cocok jadi pendamping makan siang.', 'mn_28', 'Es Kopi Susu Aren Pekat', '2026-06-28'),
('rv_11', 'Indah Kusuma', 5, 'Sup buntut sapinya empuk sekali, kuah kaldunya bening tapi kaya rasa rempah rempah alami. Sangat menyehatkan tubuh.', 'mn_12', 'Sup Buntut Sapi Rempah', '2026-06-29'),
('rv_12', 'Rudi Hartono', 5, 'Tempe mendoannya disajikan selagi panas mengepul dengan kecap cabai rawit pedas manis. Sangat gurih berkat irisan daun bawang.', 'mn_16', 'Tempe Mendoan Anget', '2026-06-30'),
('rv_13', 'Yusuf Mansur', 4, 'Ayam Betutunya memiliki rasa rempah Bali otentik yang sangat kuat. Meresap sempurna sampai ke dalam serat daging ayam.', 'mn_9', 'Ayam Betutu Gilimanuk', '2026-07-01'),
('rv_14', 'Sinta Bella', 5, 'Baksonya kenyal, kuah sumsumnya gurih kaldu sapi pekat alami bukan sekadar penyedap rasa buatan. Porsinya pas.', 'mn_13', 'Bakso Sapi Kuah Eyang', '2026-07-02'),
('rv_15', 'Andi Wijaya', 5, 'Jus Alpukatnya sangat kental, rasa coklat manisnya pas, alpukatnya tidak ada rasa pahit sama sekali. Sangat segar.', 'mn_24', 'Jus Alpukat Kerok Coklat', '2026-07-03'),
('rv_16', 'Novianti', 5, 'Ayam Taliwangnya pedasnya mantap menggigit! Sambal jeruk limau di bumbu bakarannya meresap gila-gilaan. Rekomendasi banget.', 'mn_10', 'Ayam Taliwang Lombok', '2026-07-04'),
('rv_17', 'Hendra Setiawan', 5, 'Tahu Kipisnya berisi udang besar manis segar di dalamnya. Kulit tahu kipas digoreng sangat renyah krispi.', 'mn_17', 'Tahu Kipas Udang Crispy', '2026-07-04'),
('rv_18', 'Mega Utami', 4, 'Es Teler Duriannya sungguh luar biasa harum durian Medan asli berpadu lembutnya alpukat kerok dan daging kelapa muda.', 'mn_34', 'Es Teler Istimewa Durian', '2026-07-05'),
('rv_19', 'Gilang Ramadhan', 5, 'Mie Jawa Nyemeknya lezat tiada tandingan dengan sentuhan manis gurih dan aroma smokey khas wajan besi tradisional.', 'mn_8', 'Mie Goreng Jawa Nyemek', '2026-07-05'),
('rv_20', 'Kiki Amalia', 5, 'Sambal Ulek Terasinya sangat segar karena diulek dadakan. Sangat cocok dinikmati berdampingan dengan Ayam Goreng Kremes Eyang.', 'mn_19', 'Sambal Terasi Ulek Eyang', '2026-07-06');

-- ============================================
-- RESERVATIONS (10 entries)
-- ============================================
INSERT INTO reservations (id, user_id, customer_name, customer_email, customer_phone, date, time, number_of_guests, table_number, status, special_requests, created_at) VALUES
('res_1', NULL, 'Ahmad Wijaya', 'ahmad@example.com', '0812345670', '2026-07-07', '12:00', 2, '1', 'confirmed', NULL, '2026-07-01T10:10:00Z'),
('res_2', 'usr_customer', 'Budi Wijaya', 'budi@example.com', '0812345671', '2026-07-08', '13:00', 3, '2', 'pending', 'Memerlukan kursi bayi (baby chair)', '2026-07-01T10:11:00Z'),
('res_3', NULL, 'Chandra Wijaya', 'chandra@example.com', '0812345672', '2026-07-09', '18:00', 4, '3', 'cancelled', 'Meja di area bebas asap rokok (non-smoking area)', '2026-07-01T10:12:00Z'),
('res_4', NULL, 'Diana Wijaya', 'diana@example.com', '0812345673', '2026-07-10', '19:00', 5, '4', 'confirmed', NULL, '2026-07-01T10:13:00Z'),
('res_5', NULL, 'Evi Wijaya', 'evi@example.com', '0812345674', '2026-07-11', '20:00', 2, '5', 'pending', NULL, '2026-07-01T10:14:00Z'),
('res_6', NULL, 'Fandi Wijaya', 'fandi@example.com', '0812345675', '2026-07-12', '12:00', 3, '6', 'confirmed', 'Memerlukan kursi bayi (baby chair)', '2026-07-01T10:15:00Z'),
('res_7', NULL, 'Gita Wijaya', 'gita@example.com', '0812345676', '2026-07-13', '13:00', 4, '7', 'pending', NULL, '2026-07-01T10:16:00Z'),
('res_8', NULL, 'Hadi Wijaya', 'hadi@example.com', '0812345677', '2026-07-14', '18:00', 5, '8', 'cancelled', NULL, '2026-07-01T10:17:00Z'),
('res_9', NULL, 'Indah Wijaya', 'indah@example.com', '0812345678', '2026-07-15', '19:00', 2, '9', 'confirmed', 'Memerlukan kursi bayi (baby chair)', '2026-07-01T10:18:00Z'),
('res_10', NULL, 'Joko Wijaya', 'joko@example.com', '0812345679', '2026-07-16', '20:00', 3, '10', 'pending', 'Meja di area bebas asap rokok (non-smoking area)', '2026-07-01T10:19:00Z');

-- ============================================
-- ORDERS (20 entries)
-- ============================================
INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, total_amount, status, payment_method, table_number, notes, delivery_address, created_at) VALUES
('ord_1', 'usr_customer', 'Andi Pratama', 'andi@example.com', '08987654300', 42000, 'completed', 'midtrans', '1', NULL, NULL, '2026-07-01T11:10:00Z'),
('ord_2', NULL, 'Bella Pratama', 'bella@example.com', '08987654301', 44000, 'completed', 'transfer', NULL, 'Tolong ayamnya agak kering ya kremes melimpah', NULL, '2026-07-01T12:11:00Z'),
('ord_3', NULL, 'Citra Pratama', 'citra@example.com', '08987654302', 74000, 'completed', 'cash', NULL, NULL, NULL, '2026-07-01T13:12:00Z'),
('ord_4', NULL, 'Dani Pratama', 'dani@example.com', '08987654303', 38000, 'completed', 'midtrans', '4', NULL, NULL, '2026-07-02T14:13:00Z'),
('ord_5', NULL, 'Elsa Pratama', 'elsa@example.com', '08987654304', 76000, 'completed', 'transfer', NULL, NULL, NULL, '2026-07-02T15:14:00Z'),
('ord_6', NULL, 'Farhan Pratama', 'farhan@example.com', '08987654305', 38000, 'completed', 'cash', NULL, 'Tolong ayamnya agak kering ya kremes melimpah', NULL, '2026-07-02T16:15:00Z'),
('ord_7', NULL, 'Gani Pratama', 'gani@example.com', '08987654306', 32000, 'completed', 'midtrans', '7', NULL, NULL, '2026-07-03T17:16:00Z'),
('ord_8', NULL, 'Hana Pratama', 'hana@example.com', '08987654307', 70000, 'completed', 'transfer', NULL, NULL, NULL, '2026-07-03T18:17:00Z'),
('ord_9', NULL, 'Irfan Pratama', 'irfan@example.com', '08987654308', 106000, 'completed', 'cash', NULL, NULL, NULL, '2026-07-03T19:18:00Z'),
('ord_10', NULL, 'Julia Pratama', 'julia@example.com', '08987654309', 38000, 'completed', 'midtrans', '2', NULL, NULL, '2026-07-04T11:19:00Z'),
('ord_11', NULL, 'Kiki Pratama', 'kiki@example.com', '08987654310', 76000, 'completed', 'transfer', NULL, 'Tolong ayamnya agak kering ya kremes melimpah', NULL, '2026-07-04T12:20:00Z'),
('ord_12', NULL, 'Lukman Pratama', 'lukman@example.com', '08987654311', 38000, 'completed', 'cash', NULL, NULL, NULL, '2026-07-04T13:21:00Z'),
('ord_13', NULL, 'Mira Pratama', 'mira@example.com', '08987654312', 32000, 'completed', 'midtrans', '5', NULL, NULL, '2026-07-05T14:22:00Z'),
('ord_14', NULL, 'Niko Pratama', 'niko@example.com', '08987654313', 70000, 'completed', 'transfer', NULL, NULL, NULL, '2026-07-05T15:23:00Z'),
('ord_15', NULL, 'Olga Pratama', 'olga@example.com', '08987654314', 106000, 'completed', 'cash', NULL, NULL, NULL, '2026-07-05T16:24:00Z'),
('ord_16', NULL, 'Putra Pratama', 'putra@example.com', '08987654315', 38000, 'cooking', 'midtrans', '8', NULL, NULL, '2026-07-06T17:25:00Z'),
('ord_17', NULL, 'Rina Pratama', 'rina@example.com', '08987654316', 76000, 'delivering', 'transfer', NULL, 'Tolong ayamnya agak kering ya kremes melimpah', 'Jl. Merdeka No. 10', '2026-07-06T18:26:00Z'),
('ord_18', NULL, 'Sandi Pratama', 'sandi@example.com', '08987654317', 38000, 'pending', 'cash', NULL, NULL, NULL, '2026-07-06T19:27:00Z'),
('ord_19', NULL, 'Tari Pratama', 'tari@example.com', '08987654318', 32000, 'pending', 'midtrans', '3', NULL, NULL, '2026-07-07T11:28:00Z'),
('ord_20', NULL, 'Vino Pratama', 'vino@example.com', '08987654319', 70000, 'cancelled', 'transfer', NULL, NULL, NULL, '2026-07-07T12:29:00Z');

-- ============================================
-- ORDER ITEMS
-- ============================================
INSERT INTO order_items (order_id, menu_item_id, name, price, quantity, image) VALUES
-- ord_1: 1x ayam goreng + 1x es jeruk = 32000+10000=42000
('ord_1', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_1', 'mn_22', 'Es Jeruk Peras Murni', 10000, 1, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800'),
-- ord_2: 2x ayam goreng + 1x es teh = 64000+6000 -> nah ini harus match total.. let me simplify
('ord_2', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_2', 'mn_21', 'Es Teh Manis Selasih', 6000, 2, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_3: 2x ayam goreng + 1x es jeruk = 64000+10000=74000
('ord_3', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 2, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_3', 'mn_22', 'Es Jeruk Peras Murni', 10000, 1, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800'),
-- ord_4: 1x ayam goreng + 1x es teh = 32000+6000=38000
('ord_4', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_4', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_5: 2x ayam goreng + 2x es jeruk = 64000+20000 -> hmm, let me use 2x ayam + 1x es jeruk = 74000.. but it says 76000. Let me make 2x ayam goreng + 2x es teh = 64000 + 12000 = 76000
('ord_5', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 2, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_5', 'mn_21', 'Es Teh Manis Selasih', 6000, 2, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_6
('ord_6', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_6', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_7: 32000
('ord_7', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
-- ord_8: 2x ayam + 1x es teh = 64000+6000=70000
('ord_8', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 2, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_8', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_9: 3x ayam + 1x es jeruk = 96000+10000=106000
('ord_9', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 3, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_9', 'mn_22', 'Es Jeruk Peras Murni', 10000, 1, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800'),
-- ord_10: 1x ayam + 1x es teh = 38000
('ord_10', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_10', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_11: 2x ayam + 2x es teh = 76000
('ord_11', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 2, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_11', 'mn_21', 'Es Teh Manis Selasih', 6000, 2, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_12: 1x ayam + 1x es teh = 38000
('ord_12', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_12', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_13: 1x ayam = 32000
('ord_13', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
-- ord_14: 2x ayam + 1x es teh = 70000
('ord_14', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 2, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_14', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_15: 3x ayam + 1x es jeruk = 106000
('ord_15', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 3, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_15', 'mn_22', 'Es Jeruk Peras Murni', 10000, 1, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800'),
-- ord_16: 1x ayam + 1x es teh = 38000
('ord_16', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_16', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_17: 2x ayam + 2x es teh = 76000
('ord_17', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 2, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_17', 'mn_21', 'Es Teh Manis Selasih', 6000, 2, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_18: 1x ayam + 1x es teh = 38000
('ord_18', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_18', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'),
-- ord_19: 1x ayam = 32000
('ord_19', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 1, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
-- ord_20: 2x ayam + 1x es teh = 70000
('ord_20', 'mn_1', 'Ayam Goreng Kremes Eyang', 32000, 2, 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'),
('ord_20', 'mn_21', 'Es Teh Manis Selasih', 6000, 1, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800');

-- ============================================
-- CONTACT MESSAGES
-- ============================================
INSERT INTO contact_messages (id, name, email, subject, message, status, created_at) VALUES
('msg_1', 'Rahmat Kartolo', 'rahmat@example.com', 'Tawaran Kerjasama Bahan Baku Ayam Kampung', 'Halo, saya perwakilan dari peternakan ayam organik di Yogyakarta ingin menawarkan suplai ayam kampung kualitas super secara kontinu dengan harga yang sangat bersaing.', 'unread', '2026-07-05T09:00:00Z'),
('msg_2', 'Sherly Anita', 'sherly@example.com', 'Reservasi Acara Gathering Kantor 50 Orang', 'Dear AyamEyang, kami berencana mengadakan acara gathering kantor untuk 50 orang di cabang Jakarta Selatan pada tanggal 20 Juli nanti. Apakah bisa dikirimkan proposal menu prasmanannya?', 'read', '2026-07-04T15:30:00Z');
