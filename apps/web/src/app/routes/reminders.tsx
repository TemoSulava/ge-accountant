import { useState } from "react";
import { BellRing, Mail, MessageCircle, Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../providers/auth-provider";
import { useReminders } from "../hooks/use-reminders";
import { useCreateReminder } from "../hooks/use-create-reminder";
import type { Reminder } from "../types";
import { Panel } from "../components/ui/panel";
import { Button } from "../components/ui/button";
import { Dropzone } from "../components/ui/dropzone";
import { Modal } from "../components/ui/modal";
import { Tag } from "../components/ui/tag";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  type: z.string().min(2),
  dueDate: z.string().min(1),
  channel: z.enum(["email", "telegram"])
});

type FormValues = z.infer<typeof schema>;

const channels = [
  { id: "email", labelKey: "reminders.channels.email", icon: Mail },
  { id: "telegram", labelKey: "reminders.channels.telegram", icon: MessageCircle }
];

export function RemindersPage() {
  const { activeEntity } = useAuth();
  const { t } = useTranslation();
  const entityId = activeEntity?.id;
  const remindersQuery = useReminders(entityId);
  const createReminder = useCreateReminder();
  const [isModalOpen, setModalOpen] = useState(false);

  const upcoming = (remindersQuery.data ?? []).filter((reminder) => !reminder.sentAt);
  const sent = (remindersQuery.data ?? []).filter((reminder) => reminder.sentAt);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { channel: "email" }
  });

  const onSubmit = async (values: FormValues) => {
    if (!entityId) return;
    await createReminder.mutateAsync({ entityId, ...values });
    reset({ channel: "email", type: "", dueDate: "" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl text-ink-900">{t("reminders.title")}</h2>
          <p className="text-sm text-ink-500">{t("reminders.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            {t("reminders.actions.new")}
          </Button>
          <Tag variant="warning">
            <Clock3 className="mr-2 inline h-4 w-4" />
            {t("reminders.stats.queue", { count: upcoming.length })}
          </Tag>
        </div>
      </div>

      <Panel className="space-y-6">
        <header className="flex flex-col gap-2">
          <h3 className="font-display text-lg text-ink-900">{t("reminders.sections.upcoming")}</h3>
          <p className="text-xs text-ink-500">{t("reminders.sections.upcomingCopy")}</p>
        </header>
        {remindersQuery.isLoading ? (
          <p className="py-10 text-center text-xs text-ink-400">{t("reminders.loading")}</p>
        ) : upcoming.length === 0 ? (
          <Dropzone hint={t("reminders.empty.copy")} icon={<MessageCircle className="h-6 w-6" />}>
            {t("reminders.empty.title")}
          </Dropzone>
        ) : (
          <ul className="divide-y divide-white/60 text-sm">
            {upcoming.map((reminder: Reminder) => (
              <li key={reminder.id} className="flex flex-col gap-1 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-ink-800">{reminder.type}</p>
                  <p className="text-xs text-ink-500">
                    {new Date(reminder.dueDate).toLocaleString("ka-GE", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand-600">
                  {reminder.channel}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="space-y-4">
        <header className="flex flex-col gap-2">
          <h3 className="font-display text-lg text-ink-900">{t("reminders.sections.history")}</h3>
          <p className="text-xs text-ink-500">{t("reminders.sections.historyCopy")}</p>
        </header>
        {sent.length === 0 ? (
          <p className="text-xs text-ink-400">{t("reminders.history.empty")}</p>
        ) : (
          <ul className="divide-y divide-white/60 text-xs text-ink-500">
            {sent.map((reminder) => (
              <li key={reminder.id} className="flex items-center justify-between py-3">
                <span>{reminder.type}</span>
                <span>{new Date(reminder.sentAt ?? "").toLocaleString("ka-GE", { dateStyle: "medium", timeStyle: "short" })}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={t("reminders.modal.title")}
        description={t("reminders.modal.description")}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-ink-700">{t("reminders.modal.type")}</span>
            <input
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              placeholder={t("reminders.modal.typePlaceholder")}
              {...register("type")}
            />
            {errors.type && <span className="text-xs text-rose-500">{errors.type.message}</span>}
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-ink-700">{t("reminders.modal.dueDate")}</span>
            <input
              type="datetime-local"
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              {...register("dueDate")}
            />
            {errors.dueDate && <span className="text-xs text-rose-500">{errors.dueDate.message}</span>}
          </label>

          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-ink-700">{t("reminders.modal.channel")}</span>
            {channels.map((channel) => (
              <label key={channel.id} className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 text-xs text-ink-600">
                <input type="radio" value={channel.id} {...register("channel")}
                  className="accent-brand-500" />
                <channel.icon className="h-3.5 w-3.5 text-brand-500" />
                {t(channel.labelKey)}
              </label>
            ))}
            {errors.channel && <span className="text-xs text-rose-500">{errors.channel.message}</span>}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              {t("reminders.modal.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || createReminder.isLoading}>
              {isSubmitting || createReminder.isLoading ? t("reminders.modal.saving") : t("reminders.modal.save")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
