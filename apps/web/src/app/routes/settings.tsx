import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SettingsProfileCard } from "../components/settings-profile-card";
import { SettingsNotificationCard } from "../components/settings-notification-card";
import { Panel } from "../components/ui/panel";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tag } from "../components/ui/tag";
import { Dropzone } from "../components/ui/dropzone";

const notificationChannels = [
  {
    id: "email",
    titleKey: "settings.notifications.emailTitle",
    copyKey: "settings.notifications.emailCopy",
    status: "აქტიური"
  },
  {
    id: "telegram",
    titleKey: "settings.notifications.telegramTitle",
    copyKey: "settings.notifications.telegramCopy",
    status: "ბეტა"
  }
];

export function SettingsPage() {
  const { t } = useTranslation();
  const [logo, setLogo] = useState<File | null>(null);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">{t("settings.title")}</h2>
        <p className="text-sm text-ink-500">{t("settings.subtitle")}</p>
      </header>

      <div className="grid gap-8 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <SettingsProfileCard
            form={
              <form className="grid gap-4 md:grid-cols-2">
                <Input label="IE სახელი" placeholder="მაგ. ნინო ინდ. მეწარმე" />
                <Input label="საიდენტიფიკაციო კოდი" placeholder="123456789" />
                <Input label="IBAN" placeholder="GE00BG0000000000000000" />
                <Input label="ბანკი" placeholder="საქართველოს ბანკი" />
                <Input label="წლიური ზღვარი" type="number" />
                <Input label="დროის სარტყელი" defaultValue="Asia/Tbilisi" />
                <div className="md:col-span-2 space-y-3">
                  <p className="text-sm font-medium text-ink-700">ლოგო / საბუთები</p>
                  <Dropzone
                    hint={t("settings.logo.hint")}
                    onClick={() => document.getElementById("logo-input")?.click()}
                  >
                    {logo ? logo.name : t("settings.logo.title")}
                  </Dropzone>
                  <input
                    id="logo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => setLogo(event.target.files?.[0] ?? null)}
                  />
                </div>
                <Button type="submit" className="md:col-span-2">
                  {t("settings.profile.save")}
                </Button>
              </form>
            }
          />

          <SettingsNotificationCard>
            <div className="grid gap-4">
              {notificationChannels.map((channel) => (
                <div key={channel.id} className="flex items-start justify-between gap-3 rounded-2xl bg-surface-muted/70 p-4">
                  <div>
                    <h4 className="text-sm font-semibold text-ink-800">{t(channel.titleKey)}</h4>
                    <p className="text-xs text-ink-500">{t(channel.copyKey)}</p>
                  </div>
                  <Tag variant={channel.id === "telegram" ? "warning" : "success"}>{channel.status}</Tag>
                </div>
              ))}
              <Link
                to="#"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-glow"
              >
                {t("settings.notifications.test")}
              </Link>
            </div>
          </SettingsNotificationCard>
        </div>

        <div className="space-y-8">
          <Panel className="space-y-4">
            <h3 className="font-display text-lg text-ink-900">{t("settings.audit.title")}</h3>
            <p className="text-sm text-ink-500">{t("settings.audit.copy")}</p>
            <Link to="/audit" className="text-xs font-semibold text-brand-600">
              {t("settings.audit.link")}
            </Link>
          </Panel>
          <Panel className="space-y-4">
            <h3 className="font-display text-lg text-ink-900">{t("settings.team.title")}</h3>
            <p className="text-sm text-ink-500">{t("settings.team.copy")}</p>
            <Button>{t("settings.team.invite")}</Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}
