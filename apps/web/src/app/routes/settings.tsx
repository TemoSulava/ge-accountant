import { Panel } from "../components/ui/panel";

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">პარამეტრები</h2>
        <p className="text-sm text-ink-500">შეასრულეთ სავალდებულო დეტალები, ზღვარი და კომუნიკაციები</p>
      </header>

      <Panel>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-ink-700">კომპანიის დეტალები</h3>
            <p className="text-xs text-ink-500">სახელი, საიდენთიფიკაციო კოდი, ბრუნვის ზღვარი</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-ink-700">რეგულარული შეტყობინებები</h3>
            <p className="text-xs text-ink-500">აირჩიეთ მოწოდების არხი და სიხშირე</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
