import { getT } from "next-i18next/server";
import { MapPin, Phone, Mail, Smartphone } from "lucide-react";
import { GetInTouchSection } from "@/components/sections/GetInTouchSection";

interface Props {
    params: Promise<{ lng: string }>;
}

export default async function ContactPage({ params }: Props) {
    const { lng } = await params;
    const { t } = await getT("contact", { lng });

    return (
        <div className="min-h-screen bg-background">
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden mb-16">
                <img
                    src="/images/contact_image.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />

                <div className="relative z-10 w-full mx-auto max-w-3xl px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-white text-lg font-medium tracking-wide uppercase mb-4">
                        <MapPin className="h-4 w-4" />
                        {t("eyebrow")}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05]">
                        {t("title")}
                    </h1>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4">
                {/* Uch ustunli malumot qatori */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <MapPin className="h-4.5 w-4.5 text-primary" />
                            </span>
                            <h3 className="font-bold text-primary text-lg">{t("location_title")}</h3>
                        </div>
                        <p className="text-sm font-medium text-foreground">{t("company_name")}</p>
                        <p className="text-sm text-muted-foreground">{t("location_value")}</p>

                        <div className="mt-4">
                            <p className="text-sm font-medium text-foreground">{t("operator_title")}</p>
                            <p className="text-sm text-muted-foreground">{t("operator_name")}</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Phone className="h-4.5 w-4.5 text-primary" />
                            </span>
                            <h3 className="font-bold text-primary text-lg">{t("call_title")}</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                                    <Smartphone className="h-3 w-3" />
                                    {t("mobile_label")}
                                </div>
                                <a href="tel:+998901234567" className="text-sm text-foreground hover:text-primary">
                                    +998 90 123 45 67
                                </a>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-0.5">{t("office_label")}</div>
                                <a href="tel:+998712001122" className="text-sm text-foreground hover:text-primary">
                                    +998 71 200 11 22
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="h-4.5 w-4.5 text-primary" />
                            </span>
                            <h3 className="font-bold text-primary text-lg">{t("write_title")}</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">{t("quotes_title")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("quotes_text")}{" "}
                                    <a href="mailto:info@sayt.uz" className="text-primary hover:underline">
                                        info@sayt.uz
                                    </a>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{t("consulting_title")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("consulting_text")}{" "}
                                    <a href="mailto:info@sayt.uz" className="text-primary hover:underline">
                                        info@sayt.uz
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <GetInTouchSection lng={lng} />
        </div>
    );
}