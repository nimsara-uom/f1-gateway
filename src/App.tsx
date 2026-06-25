import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export default function App() {
  const [guess, setGuess] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: guess }),
      });
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        // Small delay to show success state before redirecting
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 800);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="w-full h-screen bg-[#0B0B0B] text-white font-sans flex flex-col overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#FF8000] opacity-10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-80 h-80 bg-white opacity-5 rounded-full blur-[100px]"></div>

      {/* Top Navigation Bar */}
      <nav className="w-full px-6 lg:px-12 py-6 lg:py-8 flex justify-between items-end border-b border-white/10 relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 lg:w-12 h-6 bg-red-600 flex items-center justify-center font-black italic tracking-tighter text-xs">F1</div>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <span className="text-[9px] lg:text-[10px] tracking-[0.3em] uppercase font-bold text-white/60 truncate">Security Protocol 7.41</span>
        </div>
        <div className="text-[9px] lg:text-[10px] tracking-[0.2em] uppercase font-medium hidden sm:block">
          Access Tier: <span className="text-[#FF8000]">Restricted</span>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-stretch overflow-y-auto lg:overflow-hidden relative z-10">
        
        {/* Left Branding Column */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-12 border-b lg:border-b-0 lg:border-r border-white/10 py-12 lg:py-0 shrink-0 relative bg-[#0B0B0B]">
          <div className="mb-8 lg:mb-12 relative z-10">
            <h2 className="text-[9px] lg:text-[10px] tracking-[0.4em] uppercase text-[#FF8000] font-bold mb-4">The Gateway</h2>
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black italic tracking-tighter leading-[0.9]">SPEED<br/>IS THE<br/><span className="text-[#FF8000]">ANSWER.</span></h1>
          </div>
          
          <div className="mt-8 lg:mt-12 relative z-10">
            {/* Minimal SVG abstraction instead of realistic image to fit editorial brutalism */}
            <svg width="400" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 w-full max-w-[300px] mb-8">
              <path d="M20 100 L60 95 L140 85 L280 85 L360 95 L380 100 L385 110 L15 110 Z" fill="white" />
              <path d="M280 85 L310 40 L340 85 Z" fill="white" opacity="0.5" />
              <circle cx="80" cy="105" r="12" fill="#FF8000" />
              <circle cx="320" cy="105" r="12" fill="#FF8000" />
            </svg>
            <p className="text-[10px] lg:text-[11px] text-white/40 leading-relaxed max-w-[280px] uppercase tracking-widest relative">
              Verification required for external redirection to verified Medium publication: <br/>
              <span className="text-[#FF8000] normal-case tracking-normal mt-2 block">https://medium.com/@random111</span>
            </p>
          </div>
        </div>

        {/* Right Riddle Column */}
        <div className="w-full lg:w-[55%] flex flex-col items-center justify-center bg-[#111111] px-6 py-12 lg:py-0 lg:px-16 relative">
          <div className="w-full max-w-md relative z-10">
            <div className="mb-10">
              <div className="w-8 h-[2px] bg-[#FF8000] mb-6"></div>
              <span className="text-[10px] lg:text-xs tracking-[0.2em] font-semibold text-white/50 uppercase">Question 01 // Riddle</span>
              <h3 className="text-2xl lg:text-3xl font-light leading-snug mt-4">
                Out of the <span className="font-bold italic">Big 4</span> F1 teams, which is my favorite?
              </h3>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="relative group">
                <label className="absolute -top-2 left-4 px-2 bg-[#111111] text-[9px] lg:text-[10px] text-[#FF8000] uppercase tracking-widest font-bold z-10">
                  Your Answer
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={guess}
                    onChange={(e) => {
                      setGuess(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    disabled={status === 'success'}
                    placeholder="Type team name..." 
                    className="w-full bg-transparent border-2 border-white/10 rounded-none px-6 py-4 lg:py-5 text-lg lg:text-xl font-medium focus:outline-none focus:border-[#FF8000] transition-colors placeholder:text-white/10"
                  />
                  {status === 'error' && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-500 text-xs font-bold uppercase tracking-wider absolute -bottom-6 left-0"
                    >
                      Incorrect Access Code.
                    </motion.p>
                  )}
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={!guess.trim() || status === 'loading' || status === 'success'}
                className="w-full bg-[#FF8000] hover:bg-[#e67300] text-black font-black uppercase tracking-[0.2em] py-4 lg:py-5 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : status === 'success' ? (
                  <span>Access Granted...</span>
                ) : (
                  <>
                    Verify Identity
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                  </>
                )}
              </button>
              
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status === 'error' ? 'bg-red-500' : status === 'success' ? 'bg-green-500' : 'bg-[#FF8000] animate-pulse'}`}></div>
                  <span className="text-[9px] lg:text-[10px] text-white/30 uppercase tracking-tighter">Backend: Secure Lambda Ready</span>
                </div>
                <span className="text-[9px] lg:text-[10px] text-white/30 uppercase tracking-tighter italic">Redirects to @random111</span>
              </div>
            </form>
          </div>

          {/* Design Accent */}
          <div className="absolute bottom-12 right-6 lg:right-12 text-[50px] xl:text-[80px] font-black text-white/[0.03] pointer-events-none select-none z-0">
            GATEWAY
          </div>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="px-6 lg:px-12 py-5 lg:py-6 flex justify-between items-center bg-[#0B0B0B] border-t border-white/5 shrink-0 z-10 relative">
        <div className="flex flex-wrap gap-4 lg:gap-8 text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
          <span>Session ID: 4920-F1</span>
          <span className="hidden sm:inline">Encrypted: AES-256</span>
          <span className="hidden md:inline">Location: Instagram Redirect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 border border-[#FF8000]"></div>
          <span className="text-[8px] lg:text-[9px] uppercase tracking-widest text-white/40">McLaren Fan Gateway v1.02</span>
        </div>
      </footer>
    </div>
  );
}
