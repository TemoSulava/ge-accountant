import { Outlet, useLocation, Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { navigationItems, quickActions } from "../config/navigation";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { LanguageToggle } from "../components/ui/language-toggle";

export function AppLayout() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="grid-background">
        <div className="mx-auto flex min-h-screen max-w-[120rem] gap-10 px-6 py-10 lg:px-10">
          <aside className="hidden w-64 flex-shrink-0 flex-col justify-between rounded-3xl bg-white/70 p-6 shadow-panel backdrop-blur-2xl lg:flex">
            <div className="space-y-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {t("app.title")}
                </span>
                <h1 className="mt-4 font-display text-2xl text-ink-900">Solopreneur Control Center</h1>
                <p className="mt-2 text-sm text-ink-500">{t("app.copy.sideDescription")}</p>
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={clsx(
                        "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-brand-500 text-white shadow-glow"
                          : "text-ink-500 hover:bg-white/60 hover:text-ink-800"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{t(item.labelKey)}</span>
                      <ArrowUpRight
                        className={clsx(
                          "ml-auto h-4 w-4",
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                        )}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3 rounded-2xl bg-brand-500/10 p-4">
              <p className="text-sm font-medium text-brand-700">{t("app.sidebar.periodTitle")}</p>
              <p className="text-xs text-ink-500">{t("app.sidebar.periodCopy")}</p>
              <Link
                to="/reminders"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                {t("app.sidebar.viewTasks")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>

          <main className="flex w-full flex-col rounded-[32px] border border-white/40 bg-white/70 shadow-panel backdrop-blur-3xl">
            <header className="flex flex-col gap-6 border-b border-white/40 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-400">{t("app.copy.currentView")}</p>
                <h2 className="mt-2 font-display text-3xl text-ink-900">Solopreneur Pulse</h2>
                <p className="text-sm text-ink-500">{t("app.copy.currentViewDescription")}</p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.to}
                      to={action.to}
                      className={clsx(
                        "group flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-2 text-xs font-semibold text-white shadow-glow transition",
                        action.accent
                      )}
                    >
                      <action.icon className="h-4 w-4" />
                      {t(action.labelKey)}
                    </Link>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <section className="flex-1 overflow-y-auto p-6 lg:p-10">
              <div className="grid gap-10">
                <Outlet />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
