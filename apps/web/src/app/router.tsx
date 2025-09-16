import { createBrowserRouter, Outlet } from "react-router-dom";
import { AppLayout } from "./layouts/app-layout";
import { ProtectedRoute } from "./components/protected-route";
import { DashboardPage } from "./routes/dashboard";
import { InvoicesPage } from "./routes/invoices";
import { ExpensesPage } from "./routes/expenses";
import { BankImportPage } from "./routes/bank-import";
import { RemindersPage } from "./routes/reminders";
import { ReportsPage } from "./routes/reports";
import { AuditLogsPage } from "./routes/audit";
import { SettingsPage } from "./routes/settings";
import { LoginPage } from "./routes/login";
import { RegisterPage } from "./routes/register";
import { OnboardingPage } from "./routes/onboarding";
import { TaxPage } from "./routes/tax";
import { AppProviders } from "./providers/app-providers";

const ProvidersWrapper = () => (
  <AppProviders>
    <Outlet />
  </AppProviders>
);

export const router = createBrowserRouter([
  {
    element: <ProvidersWrapper />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/onboarding", element: <OnboardingPage /> },
          {
            element: <AppLayout />,
            children: [
              { path: "/", element: <DashboardPage /> },
              { path: "/invoices", element: <InvoicesPage /> },
              { path: "/expenses", element: <ExpensesPage /> },
              { path: "/bank-import", element: <BankImportPage /> },
              { path: "/tax", element: <TaxPage /> },
              { path: "/reminders", element: <RemindersPage /> },
              { path: "/reports", element: <ReportsPage /> },
              { path: "/audit", element: <AuditLogsPage /> },
              { path: "/settings", element: <SettingsPage /> }
            ]
          }
        ]
      }
    ]
  }
]);