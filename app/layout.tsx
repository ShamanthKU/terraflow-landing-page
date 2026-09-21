import type {Metadata} from 'next';
import { Lato, Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-newsreader',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TerraFlow AI — Unified Real Estate Intelligence',
  description: 'Turn more leads into site visits and sales with intelligent automated qualification and response.',
  openGraph: {
    title: 'TerraFlow AI — Unified Real Estate Intelligence',
    description: 'Turn more leads into site visits and sales with intelligent automated qualification and response.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TerraFlow AI — Unified Real Estate Intelligence',
    description: 'Turn more leads into site visits and sales with intelligent automated qualification and response.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${lato.variable} ${newsreader.variable} ${plusJakarta.variable}`}>
      <body suppressHydrationWarning className="bg-[#FAFBF9] text-[#2D3436] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

