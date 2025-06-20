import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'منصة الاستشارات الطبية المتطورة',
  description: 'منصة شاملة للاستشارات الطبية مع الذكاء الاصطناعي ومكالمات الفيديو عالية الجودة',
  keywords: 'استشارات طبية, أطباء, صحة, طب, ذكاء اصطناعي, مكالمات فيديو, تطبيق طبي',
  authors: [{ name: 'Medical Consultation Platform' }],
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  robots: 'index, follow',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'استشارات طبية',
  },
  openGraph: {
    title: 'منصة الاستشارات الطبية المتطورة',
    description: 'منصة شاملة للاستشارات الطبية مع الذكاء الاصطناعي ومكالمات الفيديو عالية الجودة',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'منصة الاستشارات الطبية',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'منصة الاستشارات الطبية المتطورة',
    description: 'منصة شاملة للاستشارات الطبية مع الذكاء الاصطناعي',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
