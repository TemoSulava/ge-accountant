import { ReactNode } from "react";
import { Panel } from "../components/ui/panel";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <Panel className="space-y-6">
      <header>
        <h3 className="font-display text-lg text-ink-900">{title}</h3>
        <p className="text-sm text-ink-500">{description}</p>
      </header>
      {children}
    </Panel>
  );
}

interface NotificationCardProps {
  children: ReactNode;
}

export function SettingsNotificationCard({ children }: NotificationCardProps) {
  return (
    <SettingsSection
      title="შეტყობინებების არხები"
      description="გამონახეთ სწორი კომბინაცია ელფოსტის და ტელეგრამისთვის"
    >
      {children}
    </SettingsSection>
  );
}
