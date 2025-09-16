import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/app-layout";
import { DashboardPage } from "./routes/dashboard";
import { InvoicesPage } from "./routes/invoices";
import { ExpensesPage } from "./routes/expenses";
import { BankImportPage } from "./routes/bank-import";
import { SettingsPage } from "./routes/settings";
import { RemindersPage } from "./routes/reminders";
import { ReportsPage } from "./routes/reports";
import { AuditLogsPage } from "./routes/audit";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/invoices", element: <InvoicesPage /> },
      { path: "/expenses", element: <ExpensesPage /> },
      { path: "/bank-import", element: <BankImportPage /> },
      { path: "/reminders", element: <RemindersPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/audit", element: <AuditLogsPage /> },
      { path: "/settings", element: <SettingsPage /> }
    ]
  }
]);
