import { getT } from "next-i18next/server";
import { ContactForm } from "@/components/contact/ContactForm";

interface GetInTouchSectionProps {
    lng: string;
    source: "contact" | "service";
}

export async function GetInTouchSection({ lng, source }: GetInTouchSectionProps) {
    const { t } = await getT("contact", { lng });

    return (
        <div className="bg-muted/40 py-16 md:py-20">
            <div className="mx-auto max-w-lg px-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-primary">{t("form_title")}</h2>
                <p className="text-accent font-semibold mt-2">{t("form_subtitle_short")}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{t("form_subtitle")}</p>

                <div className="mt-8 text-left">
                    <ContactForm
                        source={source}
                        labels={{
                            name: t("form_name"),
                            email: t("form_email"),
                            message: t("form_message"),
                            submit: t("form_submit"),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}