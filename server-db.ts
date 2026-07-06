/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { MenuItem, Promo, Branch, Review, Reservation, Order, User, ContactMessage, OrderStatus, OrderItem } from './src/types';

const DB_FILE = path.join(process.cwd(), 'data-ayameyang.json');

export interface DBState {
  users: User[];
  menu: MenuItem[];
  promos: Promo[];
  branches: Branch[];
  reviews: Review[];
  reservations: Reservation[];
  orders: Order[];
  contactMessages: ContactMessage[];
}

export function loadDB(): DBState {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading DB, re-seeding...', err);
    }
  }
  
  const seed = getSeedData();
  saveDB(seed);
  return seed;
}

export function saveDB(state: DBState): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

function getSeedData(): DBState {
  // Prepopulated lists
  const users: User[] = [
    {
      id: 'usr_admin',
      email: 'admin@ayameyang.com',
      name: 'Eyang Admin',
      role: 'admin',
      phone: '08123456789',
      address: 'Jalan Kaliurang KM 5, Sleman, Yogyakarta',
      createdAt: '2026-01-01T12:00:00Z'
    },
    {
      id: 'usr_customer',
      email: 'customer@ayameyang.com',
      name: 'Budi Santoso',
      role: 'customer',
      phone: '08987654321',
      address: 'Jalan Malioboro No. 42, Yogyakarta',
      createdAt: '2026-02-01T14:30:00Z'
    }
  ];

  const menu: MenuItem[] = [
    // --- MAKANAN (20 items) ---
    {
      id: 'mn_1',
      name: 'Ayam Goreng Kremes Eyang',
      description: 'Ayam goreng renyah bumbu kuning khas warisan Eyang dengan taburan kremesan super garing, disajikan lengkap dengan sambal terasi dan lalapan segar.',
      price: 32000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800',
      isAvailable: true,
      rating: 4.9,
      soldCount: 450
    },
    {
      id: 'mn_2',
      name: 'Ayam Bakar Bumbu Rujak',
      description: 'Ayam bakar yang diungkep bumbu rujak pedas manis gurih, dibakar di atas arang kelapa hingga harum meresap ke dalam serat daging.',
      price: 34000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1598515213692-5f252f75d785?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 380
    },
    {
      id: 'mn_3',
      name: 'Ayam Geprek Sambal Korek',
      description: 'Ayam goreng tepung renyah berpadu gurih pedasnya sambal korek bawang segar yang disiram minyak kelapa panas. Pedasnya juara!',
      price: 25000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 520
    },
    {
      id: 'mn_4',
      name: 'Sate Ayam Madura',
      description: '10 tusuk sate ayam empuk legendaris disiram saus kacang kental yang gurih legit, taburan bawang goreng harum, dan irisan jeruk limau.',
      price: 28000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 290
    },
    {
      id: 'mn_5',
      name: 'Soto Ayam Lamongan',
      description: 'Soto ayam berkuah kuning hangat dengan bumbu koya gurih melimpah, soun lembut, tauge, irisan kol, dan telur rebus.',
      price: 24000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1547496502-afe22d43cfab?q=80&w=800',
      isAvailable: true,
      rating: 4.6,
      soldCount: 210
    },
    {
      id: 'mn_6',
      name: 'Rendang Daging Sapi Eyang',
      description: 'Daging sapi pilihan yang dimasak perlahan selama belasan jam dengan santan kental dan rempah-rempah asli Nusantara hingga empuk berkaramel.',
      price: 45000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
      isAvailable: true,
      rating: 4.9,
      soldCount: 340
    },
    {
      id: 'mn_7',
      name: 'Nasi Goreng Spesial Eyang',
      description: 'Nasi goreng harum wajan besi bumbu kampung dengan suwiran ayam, telur mata sapi, bakso sapi, sosis, dan kerupuk udang renyah.',
      price: 26000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 410
    },
    {
      id: 'mn_8',
      name: 'Mie Goreng Jawa Nyemek',
      description: 'Mie telur tebal dimasak dengan kaldu ayam, kol, sawi hijau, suwiran ayam kampung, telur orak-arik, disajikan sedikit basah (nyemek) beraroma asap.',
      price: 25000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800',
      isAvailable: true,
      rating: 4.6,
      soldCount: 310
    },
    {
      id: 'mn_9',
      name: 'Ayam Betutu Gilimanuk',
      description: 'Ayam utuh yang dibalur dengan bumbu genep Bali yang pekat nan kaya rempah, dikukus lalu dipanggang lambat hingga merata lembutnya.',
      price: 36000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 150
    },
    {
      id: 'mn_10',
      name: 'Ayam Taliwang Lombok',
      description: 'Ayam kampung bakar khas Lombok bercita rasa ekstra pedas gurih dengan bumbu cabai merah dan terasi bakar yang merona menggoda.',
      price: 38000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 190
    },
    {
      id: 'mn_11',
      name: 'Ayam Pop khas Minang',
      description: 'Ayam kampung tanpa kulit yang direbus bumbu air kelapa dan bawang, digoreng kilat dalam minyak panas, disajikan dengan sambal merah gurih.',
      price: 33000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 175
    },
    {
      id: 'mn_12',
      name: 'Sup Buntut Sapi Rempah',
      description: 'Kuah kaldu sapi bening gurih bertabur rempah aromatik, potongan buntut sapi empuk, wortel, kentang, daun bawang seledri, dan sambal hijau.',
      price: 48000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800',
      isAvailable: true,
      rating: 4.9,
      soldCount: 220
    },
    {
      id: 'mn_13',
      name: 'Bakso Sapi Kuah Eyang',
      description: '5 butir bakso sapi urat jumbo super kenyal berdampingan tahu bakso gurih di dalam kuah kaldu sumsum sapi pekat bertabur seledri.',
      price: 24000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 300
    },
    {
      id: 'mn_14',
      name: 'Gado-Gado Siram Pengantin',
      description: 'Sayur-sayuran segar rebus, tempe, tahu, telur rebus, kentang, disiram bumbu kacang halus bertekstur legit, ditutup emping dan kerupuk bawang.',
      price: 22000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800',
      isAvailable: true,
      rating: 4.6,
      soldCount: 140
    },
    {
      id: 'mn_15',
      name: 'Tumis Cah Kangkung Terasi',
      description: 'Kangkung sawah segar renyah ditumis cepat dengan api besar bersama terasi udang premium, bawang putih, bawang merah, dan cabai iris.',
      price: 15000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800',
      isAvailable: true,
      rating: 4.5,
      soldCount: 260
    },
    {
      id: 'mn_16',
      name: 'Tempe Mendoan Anget',
      description: '5 lembar tempe lebar berbalur tepung adonan daun bawang melimpah, digoreng setengah matang khas Banyumasan, lengkap dengan kecap rawit pedas.',
      price: 12000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 480
    },
    {
      id: 'mn_17',
      name: 'Tahu Kipas Udang Crispy',
      description: '3 pcs tahu pong besar berisi tumisan sayuran wortel kol, bakso, udang cincang gurih, digoreng kering berbalut adonan tepung crispy renyah.',
      price: 18000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 190
    },
    {
      id: 'mn_18',
      name: 'Perkedel Jagung Manis',
      description: '3 buah perkedel jagung manis renyah pipil yang harum ketumbar dan irisan daun jeruk seledri, digoreng kuning keemasan.',
      price: 12000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800',
      isAvailable: true,
      rating: 4.6,
      soldCount: 230
    },
    {
      id: 'mn_19',
      name: 'Sambal Terasi Ulek Eyang',
      description: 'Sambal ulek segar khas Eyang menggunakan cabai rawit merah, tomat matang, terasi bakar Juwana premium, dan perasan jeruk purut.',
      price: 5000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800',
      isAvailable: true,
      rating: 4.9,
      soldCount: 610
    },
    {
      id: 'mn_20',
      name: 'Sambal Hijau Padang Pedes',
      description: 'Sambal ulek kasar cabai hijau segar, tomat hijau, bawang merah, ditumis gurih harum dengan minyak kelapa asli.',
      price: 5000,
      category: 'makanan',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800',
      isAvailable: true,
      rating: 4.6,
      soldCount: 325
    },

    // --- MINUMAN (10 items) ---
    {
      id: 'mn_21',
      name: 'Es Teh Manis Selasih',
      description: 'Seduhan teh melati wangi khas Solo dengan gula cair murni, disajikan dingin segar berpadu dengan butiran selasih.',
      price: 6000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 750
    },
    {
      id: 'mn_22',
      name: 'Es Jeruk Peras Murni',
      description: 'Jeruk peras Pontianak segar pilihan kaya vitamin C murni tanpa campuran perisa buatan, disajikan dingin membangkitkan dahaga.',
      price: 10000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 450
    },
    {
      id: 'mn_23',
      name: 'Es Kelapa Muda Jeruk',
      description: 'Daging kelapa muda serut lembut disajikan di dalam gelas tinggi berisi air kelapa asli, perasan jeruk manis, dan es batu segar.',
      price: 15000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1525385133336-25484724c23c?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 330
    },
    {
      id: 'mn_24',
      name: 'Jus Alpukat Kerok Coklat',
      description: 'Buah alpukat mentega segar kental diblender halus dengan pemanis alami, disajikan dengan coretan susu kental manis coklat melingkar.',
      price: 14000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800',
      isAvailable: true,
      rating: 4.6,
      soldCount: 220
    },
    {
      id: 'mn_25',
      name: 'Jus Mangga Manis Arumanis',
      description: 'Mangga Arumanis matang pohon diblender kental lembut menyegarkan tenggorokan Anda di siang hari.',
      price: 14000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 190
    },
    {
      id: 'mn_26',
      name: 'Wedang Jahe Sereh Anget',
      description: 'Minuman hangat tradisional hasil rebusan jahe merah bakar geprek, sereh wangi, dan pemanis gula merah tebu alami.',
      price: 10000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 120
    },
    {
      id: 'mn_27',
      name: 'Es Campur Segar Legendaris',
      description: 'Kolang-kaling empuk, cincau hitam, pacar cina, alpukat, kelapa serut, buah nangka harum disiram sirup merah cap bangau dan susu kental manis.',
      price: 16000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=800',
      isAvailable: true,
      rating: 4.9,
      soldCount: 280
    },
    {
      id: 'mn_28',
      name: 'Es Kopi Susu Aren Pekat',
      description: 'Espresso arabika gayo pekat berpadu susu segar gurih creamy dan sirup gula aren asli organik beraroma wangi.',
      price: 14000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 390
    },
    {
      id: 'mn_29',
      name: 'Es Teh Tarik Rempah',
      description: 'Teh hitam pekat ditarik berbusa melimpah berpadu susu kental manis dan sedikit kapulaga cengkeh harum.',
      price: 12000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 160
    },
    {
      id: 'mn_30',
      name: 'Es Soda Gembira Ria',
      description: 'Minuman soda berkarbonasi dingin yang dicampur dengan susu kental manis putih dan sirup merah frambozen.',
      price: 12000,
      category: 'minuman',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800',
      isAvailable: true,
      rating: 4.6,
      soldCount: 200
    },

    // --- DESSERT (5 items) ---
    {
      id: 'mn_31',
      name: 'Pisang Goreng Keju Caramel',
      description: 'Pisang raja matang digoreng dengan adonan tepung renyah, diberi parutan keju cheddar melimpah dan siraman saus caramel gula jawa.',
      price: 18000,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 320
    },
    {
      id: 'mn_32',
      name: 'Roti Bakar Coklat Keju Susu',
      description: '2 tangkup roti tebal dioles mentega harum, dipanggang kecoklatan dengan isi coklat meises premium dan taburan parutan keju gurih susu kental.',
      price: 18000,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800',
      isAvailable: true,
      rating: 4.7,
      soldCount: 240
    },
    {
      id: 'mn_33',
      name: 'Kolak Pisang Campur Hangat',
      description: 'Sajian dessert hangat berisi pisang kepok manis, kolang-kaling kenyal, ubi madu dalam kuah kuah santan gula kelapa harum daun pandan.',
      price: 15000,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 180
    },
    {
      id: 'mn_34',
      name: 'Es Teler Istimewa Durian',
      description: 'Es serut lembut bercampur kerokan kelapa muda, nangka harum, alpukat legit, disempurnakan sebutir daging durian Medan manis wangi.',
      price: 22000,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800',
      isAvailable: true,
      rating: 4.9,
      soldCount: 390
    },
    {
      id: 'mn_35',
      name: 'Serabi Solo Aneka Rasa',
      description: '3 gulung serabi lembut bertekstur legit khas Solo dengan varian rasa original santan gurih, keju, dan coklat meises melimpah.',
      price: 16000,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1600613247477-fe1780521e7f?q=80&w=800',
      isAvailable: true,
      rating: 4.8,
      soldCount: 150
    }
  ];

  const promos: Promo[] = [
    {
      id: 'pr_1',
      title: 'Diskon Spesial AyamEyang 10%',
      description: 'Nikmati hidangan ayam legendaris warisan resep Eyang dengan potongan instan 10% untuk semua menu tanpa minimum pembelian.',
      code: 'PROMOEYANG10',
      discountPercent: 10,
      bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
      isAvailable: true,
      minPurchase: 0
    },
    {
      id: 'pr_2',
      title: 'Kenyang Hemat Bareng AyamEyang',
      description: 'Makan berdua lebih seru dan hemat! Potongan Rp 25.000 untuk minimal pembelanjaan senilai Rp 100.000 menggunakan kode promo ini.',
      code: 'AYAMKENYANG',
      discountPercent: 15,
      bannerUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800',
      isAvailable: true,
      minPurchase: 100000
    },
    {
      id: 'pr_3',
      title: 'Kumpul Keluarga Hari Minggu',
      description: 'Waktunya makan bersama seluruh keluarga besar di hari Minggu. Dapatkan diskon spesial 20% untuk transaksi minimum Rp 200.000.',
      code: 'MINGGUKELUARGA',
      discountPercent: 20,
      bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
      isAvailable: true,
      minPurchase: 200000
    },
    {
      id: 'pr_4',
      title: 'Reservasi Meja VIP Prioritas',
      description: 'Pesan meja VIP Anda hari ini untuk pertemuan bisnis atau acara ulang tahun keluarga, dapatkan potongan instan 15% hidangan pembuka.',
      code: 'RESERVASIVIP',
      discountPercent: 15,
      bannerUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
      isAvailable: true,
      minPurchase: 150000
    },
    {
      id: 'pr_5',
      title: 'Makan Hemat Tengah Bulan',
      description: 'Jangan khawatir kantong kering di pertengahan bulan. Dapatkan diskon 12% untuk mengobati selera makan Anda sepuasnya.',
      code: 'MAKANHEMAT',
      discountPercent: 12,
      bannerUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800',
      isAvailable: true,
      minPurchase: 75000
    }
  ];

  const branches: Branch[] = [
    {
      id: 'br_1',
      name: 'AyamEyang Cabang Utama Bandung',
      address: 'Jalan Gatot Subroto, Karees Kulon No. 11/33, Bandung',
      phone: '+62 859-5646-5878 / +62 818-0222-2979',
      lat: -6.9262,
      lng: 107.6366,
      isMainBranch: true,
      comingSoon: false
    },
    {
      id: 'br_2',
      name: 'AyamEyang Cabang Jakarta',
      address: 'Jakarta (Coming Soon)',
      phone: '-',
      lat: -6.2736,
      lng: 106.8143,
      isMainBranch: false,
      comingSoon: true
    },
    {
      id: 'br_3',
      name: 'AyamEyang Cabang Yogyakarta',
      address: 'Yogyakarta (Coming Soon)',
      phone: '-',
      lat: -7.7592,
      lng: 110.3789,
      isMainBranch: false,
      comingSoon: true
    },
    {
      id: 'br_4',
      name: 'AyamEyang Cabang Surabaya',
      address: 'Surabaya (Coming Soon)',
      phone: '-',
      lat: -7.2711,
      lng: 112.7523,
      isMainBranch: false,
      comingSoon: true
    },
    {
      id: 'br_5',
      name: 'AyamEyang Cabang Solo',
      address: 'Solo (Coming Soon)',
      phone: '-',
      lat: -7.5684,
      lng: 110.8012,
      isMainBranch: false,
      comingSoon: true
    }
  ];

  const reviews: Review[] = [
    {
      id: 'rv_1',
      customerName: 'Siti Rahma',
      rating: 5,
      comment: 'Ayam Kremesnya luar biasa renyah dan bumbunya benar-benar gurih sampai ke dalam tulang! Sambal terasinya juara.',
      menuId: 'mn_1',
      menuName: 'Ayam Goreng Kremes Eyang',
      date: '2026-06-15'
    },
    {
      id: 'rv_2',
      customerName: 'Doni Setiawan',
      rating: 5,
      comment: 'Bumbu rujak di ayam bakarnya benar-benar kaya rempah. Manis, asam, gurih, dan pedasnya pas sekali dengan selera lidah Jawa saya.',
      menuId: 'mn_2',
      menuName: 'Ayam Bakar Bumbu Rujak',
      date: '2026-06-18'
    },
    {
      id: 'rv_3',
      customerName: 'Yulia Ningsih',
      rating: 4,
      comment: 'Sate ayamnya sangat empuk, saus kacangnya kental, gurih manisnya pas. Anak-anak sangat suka menu sate ini.',
      menuId: 'mn_4',
      menuName: 'Sate Ayam Madura',
      date: '2026-06-20'
    },
    {
      id: 'rv_4',
      customerName: 'Rian Hidayat',
      rating: 5,
      comment: 'Soto Lamongannya kental akan bumbu koya gurih yang melimpah ruah. Sangat nikmat dimakan hangat-hangat di musim hujan.',
      menuId: 'mn_5',
      menuName: 'Soto Ayam Lamongan',
      date: '2026-06-22'
    },
    {
      id: 'rv_5',
      customerName: 'Dewi Lestari',
      rating: 5,
      comment: 'Rendang daging sapinya sungguh lembut sekali langsung lumer di mulut. Bumbu karamelnya pekat, hitam eksotis dan sangat wangi.',
      menuId: 'mn_6',
      menuName: 'Rendang Daging Sapi Eyang',
      date: '2026-06-23'
    },
    {
      id: 'rv_6',
      customerName: 'Agus Purnomo',
      rating: 4,
      comment: 'Nasi goreng kampungnya lezat beraroma wok-hei khas wajan besi panas. Porsinya mengenyangkan, lengkap dengan telur mata sapi.',
      menuId: 'mn_7',
      menuName: 'Nasi Goreng Spesial Eyang',
      date: '2026-06-24'
    },
    {
      id: 'rv_7',
      customerName: 'Lina Marlina',
      rating: 5,
      comment: 'Ayam Geprek Sambal Koreknya benar-benar pedas meledak tapi bikin nagih terus! Untuk pecinta pedas, ini wajib dicoba.',
      menuId: 'mn_3',
      menuName: 'Ayam Geprek Sambal Korek',
      date: '2026-06-25'
    },
    {
      id: 'rv_8',
      customerName: 'Bambang Tri',
      rating: 5,
      comment: 'Sangat menyukai Es Campur segarnya! Bahan-bahannya lengkap, buah nangkanya sangat harum dan sirupnya manis murni pas.',
      menuId: 'mn_27',
      menuName: 'Es Campur Segar Legendaris',
      date: '2026-06-26'
    },
    {
      id: 'rv_9',
      customerName: 'Wulan Sari',
      rating: 5,
      comment: 'Pisang Goreng Keju Caramel adalah penutup yang sempurna. Adonannya kriuk manis, kejunya gurih melimpah di atasnya.',
      menuId: 'mn_31',
      menuName: 'Pisang Goreng Keju Caramel',
      date: '2026-06-27'
    },
    {
      id: 'rv_10',
      customerName: 'Fajar Shidiq',
      rating: 4,
      comment: 'Es Kopi Susu Arennya memiliki kombinasi pahit kopi gayo dan legit gula aren yang sangat serasi. Cocok jadi pendamping makan siang.',
      menuId: 'mn_28',
      menuName: 'Es Kopi Susu Aren Pekat',
      date: '2026-06-28'
    },
    {
      id: 'rv_11',
      customerName: 'Indah Kusuma',
      rating: 5,
      comment: 'Sup buntut sapinya empuk sekali, kuah kaldunya bening tapi kaya rasa rempah rempah alami. Sangat menyehatkan tubuh.',
      menuId: 'mn_12',
      menuName: 'Sup Buntut Sapi Rempah',
      date: '2026-06-29'
    },
    {
      id: 'rv_12',
      customerName: 'Rudi Hartono',
      rating: 5,
      comment: 'Tempe mendoannya disajikan selagi panas mengepul dengan kecap cabai rawit pedas manis. Sangat gurih berkat irisan daun bawang.',
      menuId: 'mn_16',
      menuName: 'Tempe Mendoan Anget',
      date: '2026-06-30'
    },
    {
      id: 'rv_13',
      customerName: 'Yusuf Mansur',
      rating: 4,
      comment: 'Ayam Betutunya memiliki rasa rempah Bali otentik yang sangat kuat. Meresap sempurna sampai ke dalam serat daging ayam.',
      menuId: 'mn_9',
      menuName: 'Ayam Betutu Gilimanuk',
      date: '2026-07-01'
    },
    {
      id: 'rv_14',
      customerName: 'Sinta Bella',
      rating: 5,
      comment: 'Baksonya kenyal, kuah sumsumnya gurih kaldu sapi pekat alami bukan sekadar penyedap rasa buatan. Porsinya pas.',
      menuId: 'mn_13',
      menuName: 'Bakso Sapi Kuah Eyang',
      date: '2026-07-02'
    },
    {
      id: 'rv_15',
      customerName: 'Andi Wijaya',
      rating: 5,
      comment: 'Jus Alpukatnya sangat kental, rasa coklat manisnya pas, alpukatnya tidak ada rasa pahit sama sekali. Sangat segar.',
      menuId: 'mn_24',
      menuName: 'Jus Alpukat Kerok Coklat',
      date: '2026-07-03'
    },
    {
      id: 'rv_16',
      customerName: 'Novianti',
      rating: 5,
      comment: 'Ayam Taliwangnya pedasnya mantap menggigit! Sambal jeruk limau di bumbu bakarannya meresap gila-gilaan. Rekomendasi banget.',
      menuId: 'mn_10',
      menuName: 'Ayam Taliwang Lombok',
      date: '2026-07-04'
    },
    {
      id: 'rv_17',
      customerName: 'Hendra Setiawan',
      rating: 5,
      comment: 'Tahu Kipisnya berisi udang besar manis segar di dalamnya. Kulit tahu kipas digoreng sangat renyah krispi.',
      menuId: 'mn_17',
      menuName: 'Tahu Kipas Udang Crispy',
      date: '2026-07-04'
    },
    {
      id: 'rv_18',
      customerName: 'Mega Utami',
      rating: 4,
      comment: 'Es Teler Duriannya sungguh luar biasa harum durian Medan asli berpadu lembutnya alpukat kerok dan daging kelapa muda.',
      menuId: 'mn_34',
      menuName: 'Es Teler Istimewa Durian',
      date: '2026-07-05'
    },
    {
      id: 'rv_19',
      customerName: 'Gilang Ramadhan',
      rating: 5,
      comment: 'Mie Jawa Nyemeknya lezat tiada tandingan dengan sentuhan manis gurih dan aroma smokey khas wajan besi tradisional.',
      menuId: 'mn_8',
      menuName: 'Mie Goreng Jawa Nyemek',
      date: '2026-07-05'
    },
    {
      id: 'rv_20',
      customerName: 'Kiki Amalia',
      rating: 5,
      comment: 'Sambal Ulek Terasinya sangat segar karena diulek dadakan. Sangat cocok dinikmati berdampingan dengan Ayam Goreng Kremes Eyang.',
      menuId: 'mn_19',
      menuName: 'Sambal Terasi Ulek Eyang',
      date: '2026-07-06'
    }
  ];

  // Let's pre-populate 10 reservations
  const reservations: Reservation[] = Array.from({ length: 10 }).map((_, i) => {
    const names = ['Ahmad', 'Budi', 'Chandra', 'Diana', 'Evi', 'Fandi', 'Gita', 'Hadi', 'Indah', 'Joko'];
    const timeSlots = ['12:00', '13:00', '18:00', '19:00', '20:00'];
    const dateStr = `2026-07-${String(7 + i).padStart(2, '0')}`;
    return {
      id: `res_${i + 1}`,
      userId: i === 1 ? 'usr_customer' : undefined,
      customerName: `${names[i]} Wijaya`,
      customerEmail: `${names[i].toLowerCase()}@example.com`,
      customerPhone: `081234567${i}0`,
      date: dateStr,
      time: timeSlots[i % timeSlots.length],
      numberOfGuests: (i % 4) + 2,
      tableNumber: String((i % 12) + 1),
      status: i % 3 === 2 ? 'cancelled' : i % 2 === 0 ? 'confirmed' : 'pending',
      specialRequests: i % 4 === 1 ? 'Memerlukan kursi bayi (baby chair)' : i % 4 === 2 ? 'Meja di area bebas asap rokok (non-smoking area)' : undefined,
      createdAt: `2026-07-01T10:${String(10 + i).padStart(2, '0')}:00Z`
    };
  });

  // Let's pre-populate 20 orders
  const orders: Order[] = Array.from({ length: 20 }).map((_, i) => {
    const names = ['Andi', 'Bella', 'Citra', 'Dani', 'Elsa', 'Farhan', 'Gani', 'Hana', 'Irfan', 'Julia', 'Kiki', 'Lukman', 'Mira', 'Niko', 'Olga', 'Putra', 'Rina', 'Sandi', 'Tari', 'Vino'];
    const statuses: OrderStatus[] = ['completed', 'completed', 'completed', 'cooking', 'delivering', 'pending', 'cancelled'];
    const dateStr = `2026-07-${String(Math.floor(i / 3) + 1).padStart(2, '0')}T${String(11 + (i % 9)).padStart(2, '0')}:${String(10 + (i % 50)).padStart(2, '0')}:00Z`;
    const qty1 = (i % 3) + 1;
    const qty2 = (i % 2) + 1;
    
    const items: OrderItem[] = [
      {
        menuItemId: 'mn_1',
        name: 'Ayam Goreng Kremes Eyang',
        price: 32000,
        quantity: qty1,
        image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800'
      }
    ];
    if (i % 2 === 1) {
      items.push({
        menuItemId: 'mn_21',
        name: 'Es Teh Manis Selasih',
        price: 6000,
        quantity: qty2,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800'
      });
    } else {
      items.push({
        menuItemId: 'mn_22',
        name: 'Es Jeruk Peras Murni',
        price: 10000,
        quantity: qty2,
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800'
      });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      id: `ord_${i + 1}`,
      userId: i === 0 ? 'usr_customer' : undefined,
      customerName: `${names[i]} Pratama`,
      customerEmail: `${names[i].toLowerCase()}@example.com`,
      customerPhone: `089876543${String(i).padStart(2, '0')}`,
      items,
      totalAmount,
      status: i < 15 ? 'completed' : statuses[i % statuses.length],
      paymentMethod: i % 3 === 0 ? 'midtrans' : i % 3 === 1 ? 'transfer' : 'cash',
      tableNumber: i % 4 === 0 ? String((i % 8) + 1) : undefined,
      notes: i % 5 === 1 ? 'Tolong ayamnya agak kering ya kremes melimpah' : undefined,
      createdAt: dateStr
    };
  });

  const contactMessages: ContactMessage[] = [
    {
      id: 'msg_1',
      name: 'Rahmat Kartolo',
      email: 'rahmat@example.com',
      subject: 'Tawaran Kerjasama Bahan Baku Ayam Kampung',
      message: 'Halo, saya perwakilan dari peternakan ayam organik di Yogyakarta ingin menawarkan suplai ayam kampung kualitas super secara kontinu dengan harga yang sangat bersaing.',
      status: 'unread',
      createdAt: '2026-07-05T09:00:00Z'
    },
    {
      id: 'msg_2',
      name: 'Sherly Anita',
      email: 'sherly@example.com',
      subject: 'Reservasi Acara Gathering Kantor 50 Orang',
      message: 'Dear AyamEyang, kami berencana mengadakan acara gathering kantor untuk 50 orang di cabang Jakarta Selatan pada tanggal 20 Juli nanti. Apakah bisa dikirimkan proposal menu prasmanannya?',
      status: 'read',
      createdAt: '2026-07-04T15:30:00Z'
    }
  ];

  return {
    users,
    menu,
    promos,
    branches,
    reviews,
    reservations,
    orders,
    contactMessages
  };
}
