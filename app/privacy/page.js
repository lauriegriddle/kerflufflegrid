import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Kerflufflegrid',
  description: 'Privacy Policy for Kerflufflegrid word puzzle game',
};

export default function PrivacyPage() {
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
        
        <h1 className="text-3xl font-bold text-amber-400 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
          <p className="text-sm text-slate-400">Last updated: December 2024</p>
          
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Introduction</h2>
            <p>
              Welcome to Kerflufflegrid! We respect your privacy and are committed to protecting it. 
              This Privacy Policy explains our practices regarding any information when you use our word puzzle game.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Information We Collect</h2>
            <p>
              <strong>We do not collect personal information.</strong> Kerflufflegrid is designed to be 
              played without creating an account or providing any personal data.
            </p>
            <p className="mt-3">
              <strong>Local Storage:</strong> We use your browser&apos;s local storage to save your game 
              statistics (games played, win rate, streaks, best times). This data stays on your device 
              and is never transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Cookies</h2>
            <p>
              We do not use tracking cookies. Any cookies present are strictly necessary for the 
              website to function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Third-Party Services</h2>
            <p>
              Our website may use third-party services for hosting and analytics. These services 
              may collect anonymous usage data in accordance with their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Children&apos;s Privacy</h2>
            <p>
              Kerflufflegrid is suitable for all ages. We do not knowingly collect any personal 
              information from children or any other users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on 
              this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-amber-400 mt-6 mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:lettergriddle@gmail.com" className="text-amber-400 underline">
                lettergriddle@gmail.com
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
