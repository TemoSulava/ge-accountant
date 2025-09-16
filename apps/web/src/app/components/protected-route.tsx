import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/auth-provider";
import { LoadingOverlay } from "../components/ui/loading-overlay";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-gradient">
        <LoadingOverlay heading="ვტვირთავთ მონაცემებს" message="გთხოვთ დაელოდოთ..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
