import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIMON — GO Service LATAM',
  description: 'Sistema Informativo y de Monitoreo de Soporte Técnico',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('simon-theme');
                  var hour = new Date().getHours();
                  var scheduledDark = hour >= 18 || hour < 6;
                  if (stored === 'dark' || (stored !== 'light' && scheduledDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
