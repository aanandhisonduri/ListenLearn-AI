import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import ClientLayout from './ClientLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="layout-body">
        {/* Floating blobs across all pages */}
        <div className="blob pink"></div>
        <div className="blob yellow"></div>
        <div className="blob purple"></div>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

