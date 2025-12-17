import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Kerflufflegrid - Beat the Clock Word Puzzle',
  description: 'Solve 5 scrambled words before time runs out to reveal the hidden theme! A fun, fast-paced word puzzle game.',
  keywords: 'word game, puzzle, word puzzle, unscramble, timer game, brain game',
  openGraph: {
    title: 'Kerflufflegrid - Beat the Clock Word Puzzle',
    description: 'Solve 5 scrambled words before time runs out to reveal the hidden theme!',
    url: 'https://www.kerflufflegrid.com',
    siteName: 'Kerflufflegrid',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kerflufflegrid - Beat the Clock Word Puzzle',
    description: 'Solve 5 scrambled words before time runs out to reveal the hidden theme!',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
