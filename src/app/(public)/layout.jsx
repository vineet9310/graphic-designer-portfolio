import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="layout-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
