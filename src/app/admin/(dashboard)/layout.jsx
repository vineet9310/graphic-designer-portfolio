import AdminSidebar from '@/components/AdminSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <AdminSidebar />
        <main style={{ flexGrow: 1, padding: '3rem', overflowY: 'auto' }} className="admin-main-content">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
