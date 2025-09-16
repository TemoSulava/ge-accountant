import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "./routes/dashboard";
import { InvoicesPage } from "./routes/invoices";
import { ExpensesPage } from "./routes/expenses";
import { BankImportPage } from "./routes/bank-import";
import { SettingsPage } from "./routes/settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />
  },
  {
    path: "/invoices",
    element: <InvoicesPage />
  },
  {
    path: "/expenses",
    element: <ExpensesPage />
  },
  {
    path: "/bank-import",
    element: <BankImportPage />
  },
  {
    path: "/settings",
    element: <SettingsPage />
  }
]);
