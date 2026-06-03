import AdminSidebar from '@/components/AdminSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="admin-layout-container">
        <AdminSidebar />
        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
