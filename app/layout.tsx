import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carbon Quick Check',
  description: 'Early-stage operational carbon estimates for master planning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full overflow-hidden" style={{ background: '#f6f3ec', color: '#1f2622', fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13, lineHeight: 1.5 }}>
        {children}
      </body>
    </html>
  );
}
