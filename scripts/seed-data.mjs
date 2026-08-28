/**
 * Namunaviy ma'lumotlarni backendga qo'shadigan skript (turlar + buyurtmalar + sharhlar).
 *
 * ISHLATISH:
 *   node scripts/seed-data.mjs
 *
 * Talab: Node.js 18+
 */

const API_URL = process.env.API_URL ?? "https://centralia-backend.onrender.com/api/v1";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "ravshansmile@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "KuchliParol123";

async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
    });
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }
    if (!res.ok) {
        console.error(`✗ ${options.method ?? "GET"} ${path} -> ${res.status}`);
        console.error(JSON.stringify(data, null, 2));
        throw new Error(`So'rov muvaffaqiyatsiz: ${path}`);
    }
    return data;
}

async function login(email, password) {
    const tokens = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
    return tokens.access_token;
}

async function getCountries(token) {
    const countries = await request("/countries?lang=uz", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(countries) ? countries : countries.items ?? [];
}

async function getDestinations(token) {
    const destinations = await request("/destinations?lang=uz", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(destinations) ? destinations : destinations.items ?? [];
}

async function ensureCountry(token) {
    console.log("→ Davlatlar tekshirilmoqda...");
    let countries = await getCountries(token);
    if (countries.length > 0) {
        console.log("  Topilgan davlat obyekti:", JSON.stringify(countries[0], null, 2));
        return countries;
    }
    console.log("  Davlat topilmadi, yangisi yaratilmoqda: O'zbekiston");
    const created = await request("/countries", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug: "uzbekistan", name: "O'zbekiston" }),
    });
    console.log("  Yaratilgan davlat obyekti:", JSON.stringify(created, null, 2));
    countries = await getCountries(token);
    return countries;
}

const SAMPLE_TOURS = [
    {
        title: { uz: "Samarqand — tarixiy sayohat", ru: "Самарканд — историческое путешествие", en: "Samarkand — Historical Journey" },
        short_description: { uz: "Registon va Amir Temur maqbarasiga tashrif", ru: "Посещение Регистана и мавзолея Амира Темура", en: "Visit Registan and Amir Temur Mausoleum" },
        description: { uz: "Samarqand shahrining eng mashhur tarixiy obidalarini kezib chiqamiz.", ru: "Мы посетим самые известные исторические памятники Самарканда.", en: "We will explore the most famous historical monuments of Samarkand." },
        category: "day_trip",
        duration_days: 1,
        duration_nights: 0,
        price: 45,
        currency: "USD",
        cover_image: "https://images.unsplash.com/photo-1596395463539-b4c81f3f4b3d",
        max_group_size: 15,
        is_featured: true,
        is_active: true,
    },
    {
        title: { uz: "Buxoro — qadimiy shahar sirlari", ru: "Бухара — тайны древнего города", en: "Bukhara — Secrets of the Ancient City" },
        short_description: { uz: "Buxoroning ming yillik tarixi bilan tanishing", ru: "Познакомьтесь с тысячелетней историей Бухары", en: "Discover Bukhara's thousand-year history" },
        description: { uz: "Buxoro Ark qal'asi, Poi Kalon majmuasi va boshqa tarixiy joylarga sayohat.", ru: "Путешествие в крепость Арк, комплекс Пои Калон.", en: "A journey to the Ark fortress, Poi Kalon complex." },
        category: "multi_day",
        duration_days: 3,
        duration_nights: 2,
        price: 180,
        currency: "USD",
        cover_image: "https://images.unsplash.com/photo-1584646098378-0874589d76b1",
        max_group_size: 12,
        is_featured: true,
        is_active: true,
    },
    {
        title: { uz: "Xiva — ochiq osmon ostidagi muzey", ru: "Хива — музей под открытым небом", en: "Khiva — Open-Air Museum" },
        short_description: { uz: "Ichon Qal'a devorlari ichida sayohat", ru: "Путешествие внутри стен Ичан-Калы", en: "Journey inside the walls of Itchan Kala" },
        description: { uz: "Xiva shahrining Ichon Qal'a qismi to'liq muzey-shahar bo'lib, UNESCO ro'yxatiga kiritilgan.", ru: "Часть города Хива Ичан-Кала является городом-музеем ЮНЕСКО.", en: "The Itchan Kala part of Khiva is a museum-city on the UNESCO list." },
        category: "multi_day",
        duration_days: 2,
        duration_nights: 1,
        price: 120,
        currency: "USD",
        cover_image: "https://images.unsplash.com/photo-1591109157602-9c7b2eb0c8a1",
        max_group_size: 10,
        is_featured: false,
        is_active: true,
    },
    {
        title: { uz: "Toshkent shahar turi", ru: "Тур по городу Ташкент", en: "Tashkent City Tour" },
        short_description: { uz: "Poytaxtning zamonaviy va tarixiy qismlari", ru: "Современные и исторические части столицы", en: "Modern and historical parts of the capital" },
        description: { uz: "Toshkent metrosi, Chorsu bozori, Amir Temur xiyoboni va boshqa mashhur joylar.", ru: "Метро Ташкента, базар Чорсу, сквер Амира Темура.", en: "Tashkent metro, Chorsu bazaar, Amir Temur square." },
        category: "day_trip",
        duration_days: 1,
        duration_nights: 0,
        price: 30,
        currency: "USD",
        cover_image: "https://images.unsplash.com/photo-1600100397608-1e9e14d1ae66",
        max_group_size: 20,
        is_featured: false,
        is_active: true,
    },
    {
        title: { uz: "Farg'ona vodiysi sayohati", ru: "Путешествие по Ферганской долине", en: "Fergana Valley Trip" },
        short_description: { uz: "Hunarmandchilik va tabiat go'zalliklari", ru: "Ремесла и природная красота", en: "Craftsmanship and natural beauty" },
        description: { uz: "Rishton kulolchilik ustaxonalari, Marg'ilon ipak fabrikasi va vodiyning tabiiy manzaralari.", ru: "Гончарные мастерские Риштана, шелковая фабрика Маргилана.", en: "Rishton pottery workshops, Margilan silk factory." },
        category: "multi_day",
        duration_days: 2,
        duration_nights: 1,
        price: 95,
        currency: "USD",
        cover_image: "https://images.unsplash.com/photo-1554188248-986adbb73be4",
        max_group_size: 14,
        is_featured: false,
        is_active: true,
    },
];

function slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

async function createTours(token, countries, destinations) {
    // MUHIM: agar country obyektida "id" bo'lmasa, country_ids ni umuman yubormaymiz —
    // chunki noto'g'ri formatdagi (masalan slug) qiymat backendni 500 bilan yiqitayotgan bo'lishi mumkin.
    const countryIds = countries.filter((c) => c.id).slice(0, 1).map((c) => c.id);
    const destinationIds = destinations.filter((d) => d.id).slice(0, 1).map((d) => d.id);

    console.log(`→ country_ids: ${JSON.stringify(countryIds)}, destination_ids: ${JSON.stringify(destinationIds)}`);
    console.log(`→ ${SAMPLE_TOURS.length} ta tur yaratilmoqda...`);

    const createdTours = [];

    for (const tour of SAMPLE_TOURS) {
        const payload = {
            ...tour,
            slug: slugify(tour.title.uz),
            country_ids: countryIds,
            destination_ids: destinationIds,
            itinerary: [],
        };

        try {
            const created = await request("/tours", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            console.log(`  ✓ Yaratildi: ${tour.title.uz}`);
            createdTours.push(created);
        } catch {
            console.log(`  ✗ Xato: ${tour.title.uz} (yuqoridagi log'ni ko'ring)`);
        }
    }

    return createdTours;
}

// --- Sharh qoldirish uchun: haqiqiy mijoz yaratamiz, o'tgan sanaga buyurtma qilamiz,
// admin sifatida uni "completed" qilib belgilaymiz, keyin o'sha mijoz nomidan sharh qoldiramiz ---
const REVIEWER = {
    full_name: "Aziz Karimov",
    email: `reviewer.${Date.now()}@example.com`,
    password: "TestParol123",
    phone: "+998901112233",
    preferred_language: "uz",
};

async function registerReviewer() {
    console.log("→ Sharh qoldiruvchi uchun test mijoz yaratilmoqda...");
    await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(REVIEWER),
    });
    return login(REVIEWER.email, REVIEWER.password);
}

const SAMPLE_REVIEW_TEXTS = [
    { rating: 5, text: "Ajoyib sayohat bo'ldi, gid juda bilimdon edi. Albatta yana boramiz!" },
    { rating: 4, text: "Umuman yaxshi, lekin transport biroz kechikdi. Baribir tavsiya qilaman." },
    { rating: 5, text: "Amazing experience! The guide was very knowledgeable and friendly." },
    { rating: 5, text: "Прекрасная поездка, всё было организовано на высшем уровне." },
    { rating: 4, text: "Yaxshi tur, narxi ham mos. Ovqatlanish joylarini ko'proq bo'lsa yaxshi bo'lardi." },
];

async function createBookingsAndReviews(adminToken, tours) {
    if (tours.length === 0) {
        console.log("  Hech qanday tur yo'q, buyurtma/sharh yaratilmadi.");
        return;
    }

    const reviewerToken = await registerReviewer();
    console.log("✓ Test mijoz tayyor:", REVIEWER.email);

    console.log(`→ ${tours.length} ta buyurtma yaratilmoqda (o'tgan sana bilan, sharh uchun)...`);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);
    const pastDateStr = pastDate.toISOString().split("T")[0];

    const bookingIds = [];

    for (const tour of tours) {
        try {
            const booking = await request("/bookings", {
                method: "POST",
                headers: { Authorization: `Bearer ${reviewerToken}` },
                body: JSON.stringify({
                    tour_id: tour.id,
                    full_name: REVIEWER.full_name,
                    email: REVIEWER.email,
                    phone: REVIEWER.phone,
                    tour_date: pastDateStr,
                    num_adults: 2,
                    num_children: 0,
                }),
            });
            bookingIds.push(booking.id);
            console.log(`  ✓ Buyurtma yaratildi: ${tour.title?.uz ?? tour.slug}`);
        } catch {
            console.log(`  ✗ Buyurtma xatosi: ${tour.title?.uz ?? tour.slug}`);
        }
    }

    console.log("→ Buyurtmalar admin tomonidan 'completed' deb belgilanmoqda...");
    for (const bookingId of bookingIds) {
        try {
            await request(`/bookings/${bookingId}/status`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${adminToken}` },
                body: JSON.stringify({ status: "completed" }),
            });
        } catch {
            console.log(`  ✗ Holatni yangilab bo'lmadi: ${bookingId}`);
        }
    }

    console.log(`→ ${tours.length} ta sharh yaratilmoqda...`);
    for (let i = 0; i < tours.length; i++) {
        const tour = tours[i];
        const r = SAMPLE_REVIEW_TEXTS[i % SAMPLE_REVIEW_TEXTS.length];
        try {
            await request("/reviews", {
                method: "POST",
                headers: { Authorization: `Bearer ${reviewerToken}` },
                body: JSON.stringify({
                    tour_id: tour.id,
                    reviewer_name: REVIEWER.full_name,
                    rating: r.rating,
                    text: r.text,
                    images: [],
                }),
            });
            console.log(`  ✓ Sharh yaratildi: ${tour.title?.uz ?? tour.slug}`);
        } catch {
            console.log(`  ✗ Sharh xatosi: ${tour.title?.uz ?? tour.slug} (yuqoridagi log'ni ko'ring)`);
        }
    }
}

async function main() {
    const adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log("✓ Admin login muvaffaqiyatli");

    const countries = await ensureCountry(adminToken);
    const destinations = await getDestinations(adminToken);

    const createdTours = await createTours(adminToken, countries, destinations);

    await createBookingsAndReviews(adminToken, createdTours);

    console.log("Tayyor!");
}

main().catch((err) => {
    console.error("Skript to'xtadi:", err.message);
    process.exit(1);
});