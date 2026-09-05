export const siteConfig = {
    logo: {
        src: "/images/logo.png",
        alt: "DiscoverStans",
        useImage: false,
        name: "Discover",
        nameHighlight: "Stans",
        initials: "DS",
    },

    description:
        "Samarqand va O'zbekiston bo'ylab unutilmas sayohatlar tashkil qilamiz - tarix, madaniyat va mehmondo'stlik bir joyda.",

    copyright: "Barcha huquqlar himoyalangan.",

    contact: {
        email: "discoverstans.uz@gmail.com",
        phone: "+998 99 343 40 94 ",
        phoneSecondary: "",
        address: "Samarqand, O'zbekiston",
    },

    social: {
        instagram: "https://instagram.com/discoverstans",
        facebook: "https://facebook.com/discoverstans",
        telegram: "https://t.me/discoverstans",
        youtube: "",
        tiktok: "",
        whatsapp: "",
    },
};

export type SiteConfig = typeof siteConfig;