import {
  BookmarkCheck,
  CalendarCheck2,
  CreditCard,
  FileText,
  Home,
  LineChart,
  ReceiptText,
  ScrollText,
  Settings,
  Scale
} from "lucide-react";

export interface NavigationItem {
  labelKey: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navigationItems: NavigationItem[] = [
  { labelKey: "app.nav.dashboard", path: "/", icon: Home },
  { labelKey: "app.nav.invoices", path: "/invoices", icon: FileText },
  { labelKey: "app.nav.expenses", path: "/expenses", icon: ReceiptText },
  { labelKey: "app.nav.bankImport", path: "/bank-import", icon: CreditCard },
  { labelKey: "app.nav.tax", path: "/tax", icon: Scale },
  { labelKey: "app.nav.reminders", path: "/reminders", icon: CalendarCheck2 },
  { labelKey: "app.nav.reports", path: "/reports", icon: LineChart },
  { labelKey: "app.nav.audit", path: "/audit", icon: ScrollText },
  { labelKey: "app.nav.settings", path: "/settings", icon: Settings }
];

export const quickActions = [
  {
    labelKey: "app.actions.newInvoice",
    to: "/invoices/new",
    icon: BookmarkCheck,
    accent: "from-brand-400 to-brand-600"
  },
  {
    labelKey: "app.actions.newExpense",
    to: "/expenses/new",
    icon: ReceiptText,
    accent: "from-sky-300 to-sky-500"
  },
  {
    labelKey: "app.actions.importBank",
    to: "/bank-import",
    icon: CreditCard,
    accent: "from-emerald-300 to-emerald-500"
  }
];
