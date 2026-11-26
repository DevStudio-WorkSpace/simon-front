import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const montserrat = localFont({
  src: './fonts/Montserrat-Variable.ttf',
  weight: '100 900',
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'SIMON — GO Service LATAM',
  description: 'Sistema Informativo y de Monitoreo de Soporte Técnico',
  icons: {
    icon: '/go-service-latam.png',
    shortcut: '/go-service-latam.png',
    apple: '/go-service-latam.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="only light" />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
