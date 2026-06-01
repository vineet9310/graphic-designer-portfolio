import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Alex | Graphic & Brand Designer Portfolio',
  description: 'Premium visual identities, digital products, and high-impact designs for bold brands.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              },
              success: {
                iconTheme: {
                  primary: '#e63946',
                  secondary: '#ffffff',
                },
              }
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
