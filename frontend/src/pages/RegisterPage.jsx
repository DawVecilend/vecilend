import React, { useState } from 'react';
import HeaderDesktop from '../components/layouts/header/HeaderDesktop';
import FooterDesktop from '../components/layouts/footer/FooterDesktop';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [step, setStep] = useState(1);

  const handleContinue = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased min-h-screen flex flex-col dark">
      <HeaderDesktop />

      {step === 1 ? (
        // ==========================================
        // PASO 1: FORMULARIO DE REGISTRO
        // ==========================================
        <main className="flex-grow pt-24 pb-12 flex flex-col md:flex-row">
          <section className="hidden md:flex md:w-1/2 relative bg-[#090f0e] items-center justify-center p-12 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                alt="Professional Gear" 
                className="w-full h-full object-cover opacity-40" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQW8YXGcPQGsj1Q0KeE6EM5PNeIb_2pLMJDvddODr88dUMeNgFpr5Qs5dEO2AB3ny82vvXhxKR1aN2E7BqjU2sV5FtcQZ-345ynN76RDdZv2smlnejUHG2dyJnTy2VyYGx6-IWF-CKxfbXp8pzNllfgIcWjEMqPvNwxWyDXubGsjAiiVqX-uFuvxCluOPaesKLrAtqv5nHmjRfKM-WAQLXtTiquVhbmhJZ62YM7sq7EbMBlR3I8WQF1s_63H87bU9H2tZ7BGot5ARl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0e1513] via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-lg">
              <div className="bg-[#1a211f]/60 backdrop-blur-xl border border-[#3c4947] p-8 rounded-xl shadow-2xl">
                <div className="flex gap-1 mb-4 text-[#4fdbc8]">
                  <span className="material-symbols-outlined icon-filled">star</span>
                  <span className="material-symbols-outlined icon-filled">star</span>
                  <span className="material-symbols-outlined icon-filled">star</span>
                  <span className="material-symbols-outlined icon-filled">star</span>
                  <span className="material-symbols-outlined icon-filled">star</span>
                </div>
                <p className="text-xl font-medium leading-relaxed italic text-[#dde4e1] mb-6">
                  "The quality of the equipment and the seamless professional workflow completely transformed how we handle our high-stakes productions."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4fdbc8]">
                    <img 
                      alt="User Avatar" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3lCex78R9gss1rSRXiBMONf6Kpo-aObjVvhOsdxYfDEV5VkAjs6H5udYWFVTbBQLLe-5OX-1Nfr__L2EXX8_85qkavwodEygWuVjZ6R_S-ujoopRTJ6XdUyiVw_F4VHAySzA5WVdjgh6exDBGT_RwCUnYkkCZZYY6CTNyMrYDouOrmBTLw1SX27Er49FLqX-_HboWJrblOlE2XV8QqCIM-hFlX3WtzUVzAQ7DIjz6roiYJcCohYGKap5Asn5a0VIiVco4tNU-khmT"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#dde4e1]">Alex Chen</p>
                    <p className="text-sm text-[#859490]">Creative Director, Lumina Studios</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 flex flex-col justify-center px-6 py-12 md:px-24 bg-[#0e1513]">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#4fdbc8] font-bold text-sm tracking-widest uppercase">Step 1 of 3</span>
                  <span className="text-[#859490] text-xs uppercase font-semibold">Account Info</span>
                </div>
                <div className="h-1.5 w-full bg-[#1a211f] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4fdbc8] w-1/3 rounded-full"></div>
                </div>
              </div>
              
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-[#dde4e1] tracking-tight mb-2">Create Account</h1>
                <p className="text-[#859490]">Join the community of elite professionals today.</p>
              </div>
              
              <div className="flex flex-col gap-3 mb-8">
                <button className="w-full flex items-center justify-center gap-3 bg-[#1a211f] hover:bg-[#252b2a] border border-[#3c4947] py-3 rounded-lg font-medium transition-all active:scale-[0.98]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span>Continue with Google</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-[#1a211f] hover:bg-[#252b2a] border border-[#3c4947] py-3 rounded-lg font-medium transition-all active:scale-[0.98]">
                  <svg className="w-5 h-5 fill-[#dde4e1]" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.002-.156-3.725 1.09-4.51 1.09zM15.53 4.854c.87-1.05 1.454-2.506 1.293-3.96-1.247.052-2.76.831-3.656 1.883-.792.935-1.48 2.442-1.293 3.869 1.39.104 2.786-.74 3.656-1.792z"></path>
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>
              
              <div className="relative flex items-center justify-center mb-8">
                <div className="flex-grow border-t border-[#3c4947]"></div>
                <span className="mx-4 text-xs font-bold text-[#859490] uppercase">Or use email</span>
                <div className="flex-grow border-t border-[#3c4947]"></div>
              </div>
              
              <form className="space-y-6" onSubmit={handleContinue}>
                <div>
                  <label className="block text-sm font-semibold text-[#bbcac6] mb-2">Full Name</label>
                  <input 
                    className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all" 
                    placeholder="John Doe" 
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#bbcac6] mb-2">Email Address</label>
                  <input 
                    className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all" 
                    placeholder="john@company.com" 
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#bbcac6] mb-2">Password</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-[#161d1b] border border-[#3c4947] rounded-lg px-4 py-3 text-[#dde4e1] focus:ring-2 focus:ring-[#4fdbc8] focus:border-transparent outline-none transition-all" 
                      placeholder="••••••••" 
                      type="password"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#859490] cursor-pointer">visibility</span>
                  </div>
                  <p className="text-[10px] text-[#859490] mt-2">Minimum 8 characters with at least one number and special character.</p>
                </div>
                <button 
                  className="w-full bg-[#4fdbc8] hover:bg-[#14b8a6] text-[#003731] font-bold py-4 rounded-lg shadow-lg shadow-[#4fdbc8]/20 transition-all active:scale-[0.97] mt-4 flex items-center justify-center gap-2" 
                  type="submit"
                >
                  <span>Continue to Step 2</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
              
              <p className="mt-8 text-center text-xs text-[#859490] leading-relaxed">
                By registering, you agree to our <Link to="/terms" className="text-[#4fdbc8] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#4fdbc8] hover:underline">Privacy Policy</Link>.
              </p>
            </div>
          </section>
        </main>
      ) : (
        // ==========================================
        // PASO 2: VERIFICACIÓN DE CORREO (OTP)
        // ==========================================
        <main className="flex-grow flex flex-col items-center justify-center px-4 pt-24 pb-12">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <div className="flex justify-between mb-3 px-1">
                <span className="text-xs font-bold tracking-widest text-[#4fdbc8] uppercase">Step 2 of 3</span>
                <span className="text-xs font-medium text-[#859490]">Email Verification</span>
              </div>
              <div className="flex h-1.5 w-full bg-[#1a211f] rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#4fdbc8]/30"></div>
                <div className="h-full w-1/3 bg-[#4fdbc8]"></div>
                <div className="h-full w-1/3 bg-transparent"></div>
              </div>
            </div>

            {/* Añadido "relative" para posicionar el botón de volver */}
            <div className="bg-[#1a211f] rounded-xl p-8 border border-[#3c4947] shadow-2xl relative">
              
              {/* Botón para volver al Paso 1 */}
              <button 
                onClick={() => setStep(1)} 
                className="absolute top-6 left-6 flex items-center gap-1 text-[#859490] hover:text-[#4fdbc8] transition-colors font-medium text-sm"
                aria-label="Back to previous step"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back</span>
              </button>

              <div className="flex flex-col items-center mb-8 mt-4">
                <div className="w-24 h-24 bg-[#14b8a6]/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-[#14b8a6]/5">
                  <span className="material-symbols-outlined icon-filled text-[#4fdbc8] text-5xl">mail</span>
                </div>
                <h1 className="text-2xl font-bold text-[#dde4e1] mb-2 text-center">Check your inbox!</h1>
                <p className="text-[#bbcac6] text-center text-sm leading-relaxed">
                  We've sent a verification link to your email. Click the link in the message to confirm your account.
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-[#3c4947]"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#859490]">OR ENTER CODE</span>
                  <div className="flex-grow border-t border-[#3c4947]"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between gap-2">
                    <input className="w-12 h-14 bg-[#252b2a] border-2 border-[#3c4947] rounded-lg text-center text-xl font-bold text-[#4fdbc8] focus:border-[#4fdbc8] focus:ring-0 outline-none transition-colors" maxLength="1" placeholder="·" type="text"/>
                    <input className="w-12 h-14 bg-[#252b2a] border-2 border-[#3c4947] rounded-lg text-center text-xl font-bold text-[#4fdbc8] focus:border-[#4fdbc8] focus:ring-0 outline-none transition-colors" maxLength="1" placeholder="·" type="text"/>
                    <input className="w-12 h-14 bg-[#252b2a] border-2 border-[#3c4947] rounded-lg text-center text-xl font-bold text-[#4fdbc8] focus:border-[#4fdbc8] focus:ring-0 outline-none transition-colors" maxLength="1" placeholder="·" type="text"/>
                    <input className="w-12 h-14 bg-[#252b2a] border-2 border-[#3c4947] rounded-lg text-center text-xl font-bold text-[#4fdbc8] focus:border-[#4fdbc8] focus:ring-0 outline-none transition-colors" maxLength="1" placeholder="·" type="text"/>
                    <input className="w-12 h-14 bg-[#252b2a] border-2 border-[#3c4947] rounded-lg text-center text-xl font-bold text-[#4fdbc8] focus:border-[#4fdbc8] focus:ring-0 outline-none transition-colors" maxLength="1" placeholder="·" type="text"/>
                    <input className="w-12 h-14 bg-[#252b2a] border-2 border-[#3c4947] rounded-lg text-center text-xl font-bold text-[#4fdbc8] focus:border-[#4fdbc8] focus:ring-0 outline-none transition-colors" maxLength="1" placeholder="·" type="text"/>
                  </div>
                  
                  <button className="w-full bg-[#4fdbc8] text-[#003731] font-bold py-3.5 rounded-lg hover:bg-[#14b8a6] transition-all active:scale-[0.98] shadow-lg shadow-[#4fdbc8]/10">
                    Verify Code
                  </button>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-xs text-[#bbcac6] mb-3">Didn't receive the email?</p>
                  <button className="inline-flex items-center gap-2 text-[#4fdbc8] font-semibold text-sm hover:underline active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Resend Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      <FooterDesktop />
    </div>
  );
}

export default RegisterPage;