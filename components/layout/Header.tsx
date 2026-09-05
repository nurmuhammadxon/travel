"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useT } from "next-i18next/client";
import { Menu, User as UserIcon, LayoutDashboard, LogOut, ClipboardList } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { GirihBorder } from "./GirihBorder";
import i18nConfig from "../../i18n.config";
import { useLocalizedHref } from "@/hooks/use-localized-href";
import { cn, localizedHref } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/lib/auth";
import { SiteLogo } from "../shared/site-logo";

const NAV_LINKS = [
  { href: "/", key: "nav.home" },
  { href: "/tours", key: "nav.tours" },
  { href: "/about", key: "nav.about" },
  { href: "/services", key: "nav.service" },
  { href: "/contact", key: "nav.contact" },
];

const LANGUAGES = [
  { code: "en", label: "English", },
  { code: "uz", label: "O'zbekcha", },
  { code: "ru", label: "Русский", },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useT("common");
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const withLocale = useLocalizedHref();

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    router.push(withLocale("/"));
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = i18nConfig.supportedLngs.includes(segments[0])
    ? segments[0]
    : i18nConfig.fallbackLng;
  const pathWithoutLocale = i18nConfig.supportedLngs.includes(segments[0])
    ? segments.slice(1)
    : segments;

  const DARK_HERO_ROUTES = ["", "about", "contact", "services", "tours", "login"];
  const isDarkHeroRoute =
    pathWithoutLocale.length <= 1 && DARK_HERO_ROUTES.includes(pathWithoutLocale[0] ?? "");
  const isTransparent = isDarkHeroRoute && !scrolled;

  function switchLocale(locale: string) {
    const rest = pathWithoutLocale.join("/");
    router.push(localizedHref(locale, rest ? `/${rest}` : "/", i18nConfig.fallbackLng));
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isTransparent
        ? "bg-transparent"
        : "bg-background backdrop-blur-md shadow-md"
        }`}
    >
      <nav className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16 md:h-20">
        <Link href={withLocale("/")} className="flex items-center gap-2 shrink-0">
          <SiteLogo
            textClassName={`text-xl md:text-2xl font-bold tracking-tight transition-colors ${isTransparent ? "text-white" : "text-primary"
              }`}
            highlightClassName="text-accent"
          />
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const href = withLocale(link.href);
            const isActive = pathname === href || pathname.endsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={withLocale(link.href)}
                  className={`text-base font-bold transition-colors duration-500 delay-75 hover:text-accent ${isActive
                    ? "text-accent"
                    : isTransparent
                      ? "text-white"
                      : "text-muted-foreground"
                    }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="hidden md:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              style={{ borderRadius: "9999px" }}
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full! w-10 h-10 aspect-square p-0 flex items-center justify-center text-xs font-bold bg-primary text-white hover:bg-primary/90 hover:scale-110 transition-transform duration-200"
              )}
            >
              {currentLocale}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem key={lang.code} onClick={() => switchLocale(lang.code)} className="gap-2">
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                style={{ borderRadius: "9999px" }}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full! w-10 h-10 aspect-square p-0 flex items-center justify-center bg-primary text-white hover:bg-primary/90 hover:scale-110 transition-transform duration-200"
                )}
                aria-label={user.full_name}
              >
                <UserIcon className="h-4.5 w-4.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium truncate">{user.full_name}</p>
                  <p className="text-[0.65rem] text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                {isAdminUser(user) && (
                  <DropdownMenuItem onClick={() => router.push(withLocale("/admin"))} className="gap-2">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    {t("nav.admin_panel")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push(withLocale("/profile"))} className="gap-2">
                  <ClipboardList className="h-3.5 w-3.5" />
                  {t("nav.profile")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
                  <LogOut className="h-3.5 w-3.5" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href={withLocale("/login")}
              className="p-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-200 hover:scale-110"
              aria-label={t("nav.login")}
            >
              <UserIcon className="h-4.5 w-4.5" />
            </Link>
          )}

        </div>

        <div className="flex md:hidden items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              style={{ borderRadius: "9999px" }}
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full! w-10 h-10 aspect-square p-0 flex items-center justify-center text-xs font-bold bg-primary text-white hover:bg-primary/90 hover:scale-110 transition-transform duration-200"
              )}
            >
              {currentLocale}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem key={lang.code} onClick={() => switchLocale(lang.code)} className="gap-2">
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="md:hidden"
              render={
                <Button
                  size="icon"
                  aria-label="Menyu"
                  className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 hover:scale-110 transition-transform duration-200"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-10 px-4">
                <ul className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={withLocale(link.href)}
                        onClick={() => setMobileOpen(false)}
                        className="text-base font-medium text-foreground"
                      >
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3 pt-4 border-t">
                  {user ? (
                    <>
                      <div className="px-1">
                        <p className="text-sm font-medium truncate">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      {isAdminUser(user) && (
                        <Link
                          href={withLocale("/admin")}
                          onClick={() => setMobileOpen(false)}
                          className={cn(buttonVariants({ variant: "outline" }), "gap-2 rounded-full")}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          {t("nav.admin_panel")}
                        </Link>
                      )}
                      <Link
                        href={withLocale("/profile")}
                        onClick={() => setMobileOpen(false)}
                        className={cn(buttonVariants({ variant: "outline" }), "gap-2 rounded-full")}
                      >
                        <ClipboardList className="h-4 w-4" />
                        {t("nav.profile")}
                      </Link>
                      <Button
                        onClick={handleLogout}
                        className={cn(buttonVariants({ variant: "outline" }), "gap-2 rounded-full text-destructive")}
                      >
                        <LogOut className="h-4 w-4" />
                        {t("nav.logout")}
                      </Button>
                    </>
                  ) : (
                    <Link
                      href={withLocale("/login")}
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants({ variant: "outline" }), "gap-2 rounded-full")}
                    >
                      <UserIcon className="h-4 w-4" />
                      {t("nav.login")}
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      {!isTransparent && <GirihBorder />}
    </header>
  );
}