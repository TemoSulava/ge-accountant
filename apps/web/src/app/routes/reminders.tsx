import { BellRing, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Panel } from "../components/ui/panel";

const reminders = [
  {
    id: "rem-1",
    type: "RS_DECLARATION",
    due: "2025-10-15T09:00:00+04:00",
    channel: "ელფოსტა",
    description: "სამეტაპიანი შეხსენება დეკლარაციისთვის"
  },
  {
    id: "rem-2",
    type: "INVOICE_DUE",
    due: "2025-09-28T18:00:00+04:00",
    channel: "ტელეგრამი",
    description: "ინვოისი #2025-004 დასაფარად"
  }
];

export function RemindersPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-ink-900">დავალებები და შეხსენებები</h2>
        <p className="text-sm text-ink-500">დაგეგმეთ ავტომატური ელ.ფოსტა და ტელეგრამ შეტყობინებები</p>
      </header>

      <Panel>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-ink-700">მომდევნო 7 დღის შეხსენებები</h3>
              <p className="text-xs text-ink-500">Cron გაშვება ყოველდღე 09:00 Asia/Tbilisi</p>
            </div>
            <Link
              to="/reminders/new"
              className="inline-flex items-center gap-2 rounded-full border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-600"
            >
              <BellRing className="h-4 w-4" />
              ახალი შეხსენება
            </Link>
          </div>

          <ul className="space-y-4">
            {reminders.map((reminder) => (
              <li key={reminder.id} className="flex items-center justify-between rounded-2xl bg-surface-muted/80 px-4 py-3">
                <div className="flex flex-col text-sm text-ink-600">
                  <span className="font-medium text-ink-800">{reminder.type}</span>
                  <span className="text-xs text-ink-500">
                    {new Date(reminder.due).toLocaleString("ka-GE", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                  <span className="text-xs text-ink-400">{reminder.description}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-500">
                  {reminder.channel === "ელფოსტა" ? <Mail className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                  <span>{reminder.channel}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
