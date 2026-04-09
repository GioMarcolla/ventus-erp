import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import './globals.css';

// Main UI Font (Geist)
const geistSans = localFont({
    src: [
        {
            path: '../../public/fonts/Geist.ttf',
            weight: '100 900',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Geist-Italic.ttf',
            weight: '100 900',
            style: 'italic',
        },
    ],
    variable: '--font-geist-sans',
    display: 'swap',
});

// Technical/Data Font (GeistMono)
const geistMono = localFont({
    src: [
        {
            path: '../../public/fonts/GeistMono.ttf',
            weight: '100 900',
            style: 'normal',
        },
        {
            path: '../../public/fonts/GeistMono-Italic.ttf',
            weight: '100 900',
            style: 'italic',
        },
    ],
    variable: '--font-geist-mono',
    display: 'swap',
});

// Viewport handles the 'theme-color' of the browser's address bar
export const viewport: Viewport = {
    themeColor: '#008C45', // Official Italian Verde
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, // Prevents accidental zooming on inputs for elders
};

export const metadata: Metadata = {
    metadataBase: new URL('https://seu-erp.com.br'),

    title: {
        template: '%s | Círculo Ítalo-Brasileiro',
        default: 'Gestão ERP | Círculo Ítalo-Brasileiro', // The primary title
    },
    description: 'Sistema central de gestão para a Comunidade Ítalo-Brasileira: Membros, Eventos e Mensalidades.',
    keywords: ['ERP', 'Italo-Brasileiro', 'Gestão de Membros', 'Comunidade', 'Itália'],
    authors: [{ name: 'CIB Tech Team' }],

    // OpenGraph (Social Media & Link Preview)
    openGraph: {
        title: 'Círculo Ítalo-Brasileiro ERP',
        description: 'Plataforma administrativa da comunidade.',
        url: 'https://seu-erp.com.br',
        siteName: 'CIB ERP',
        locale: 'pt_BR',
        type: 'website',
        images: [
            {
                url: '/og-image.png', // Place a 1200x630 image in /public
                width: 1200,
                height: 630,
                alt: 'Círculo Ítalo-Brasileiro Dashboard',
            },
        ],
    },

    // Apple/Mobile Web App settings
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'CIB ERP',
    },

    // Standard Favicon/Icons
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
            <head></head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
        </html>
    );
}
