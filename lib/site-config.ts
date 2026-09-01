/**
 * Saytning statik konfiguratsiyasi — logo, ijtimoiy tarmoqlar, aloqa ma'lumotlari.
 * Bu ma'lumotlar backend'da saqlanmaydi (tegishli API endpoint yo'q), shuning uchun
 * bu yerda kod ichida belgilanadi. O'zgartirish kerak bo'lsa, shu faylni tahrirlab,
 * saytni qayta joylashtiring (deploy).
 */

export const siteConfig = {
    logo: {
        // Logo rasm manzili (public/ papkasiga joylashtiring, masalan public/logo.png)
        src: "/logo.png",
        alt: "DiscoverStans",
    },

    contact: {
        email: "info@discover-stans.uz",
        phone: "+998 90 123 45 67",
        // Ixtiyoriy: ikkinchi telefon raqami
        phoneSecondary: "",
        address: "Toshkent, O'zbekiston",
    },

    social: {
        instagram: "https://instagram.com/discoverstans",
        facebook: "https://facebook.com/discoverstans",
        telegram: "https://t.me/discoverstans",
        // Kerak bo'lmagan tarmoqlar uchun bo'sh matn qoldiring — Footer avtomatik yashiradi
        youtube: "",
        tiktok: "",
        whatsapp: "",
    },
};

export type SiteConfig = typeof siteConfig;