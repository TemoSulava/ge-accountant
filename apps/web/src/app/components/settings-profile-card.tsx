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

interface ProfileCardProps {
  form: ReactNode;
}

export function SettingsProfileCard({ form }: ProfileCardProps) {
  return (
    <SettingsSection
      title="პროფილის პარამეტრები"
      description="განაახლეთ ინდ. მეწარმის ძირითადი ინფორმაცია, IBAN და ზღვარი"
    >
      {form}
    </SettingsSection>
  );
}
