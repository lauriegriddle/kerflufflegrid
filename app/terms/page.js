import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Kerflufflegrid',
  description: 'Terms of Service for Kerflufflegrid word puzzle game',
};

export default function TermsPage() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8"
        >
          ← Back to Game
        </Link>
        
        <h1 className="text-3xl font-bold text-amber-400 mb-6">Terms of Service</h1>
        
        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
          <p className="text-sm text-slate-400">Last updated: December 2024</p>
          
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Welcome to Kerflufflegrid!</h2>
            <p>
              By accessing and using Kerflufflegrid, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the game.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Use of the Game</h2>
            <p>
              Kerflufflegrid is a free word puzzle game provided for entertainment purposes. You may 
              use the game for personal, non-commercial use only.
            </p>
            <p className="mt-3">You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Attempt to hack, disrupt, or interfere with the game&apos;s operation</li>
              <li>Use automated systems or bots to play the game</li>
              <li>Copy, modify, or distribute the game&apos;s content without permission</li>
              <li>Use the game for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Intellectual Property</h2>
            <p>
              All content, design, graphics, and code of Kerflufflegrid are owned by us and protected 
              by intellectual property laws. The game name, logo, and visual design are our property.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Disclaimer</h2>
            <p>
              Kerflufflegrid is provided &quot;as is&quot; without warranties of any kind. We do not guarantee 
              that the game will be error-free or continuously available. We are not responsible for 
              any loss of game statistics or data stored in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable for any indirect, 
              incidental, special, or consequential damages arising from your use of Kerflufflegrid.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be 
              effective immediately upon posting. Your continued use of the game constitutes 
              acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:{' '}
              <a href="mailto:lettergriddle@gmail.com" className="text-amber-400 underline">
                lettergriddle@gmail.com
              </a>
            </p>
            <p className="mt-3">
              Follow us on Instagram:{' '}
              <a 
                href="https://instagram.com/letter_griddle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 underline"
              >
                @letter_griddle
              </a>
            </p>
          </section>
        </div>
        
        <div className="mt-12 pt-6 border-t border-slate-700 text-center text-slate-500 text-sm">
          © {currentYear} Kerflufflegrid
        </div>
      </div>
    </div>
  );
}
