import React from 'react';
import { Link } from 'react-router-dom';

function HowItWorksPage() {
    return (
        <div className="font-inter text-[#dde4e1] min-h-screen antialiased">
            <section className="relative w-full overflow-hidden py-12 md:py-20">
                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
                    <div className="relative z-10">
                        <span className="mb-6 inline-block rounded-full border border-vecilend-dark-primary/20 bg-vecilend-dark-primary/10 px-4 py-1.5 font-body text-caption font-bold uppercase tracking-[0.18em] text-vecilend-dark-primary">
                            Comparte con confianza
                        </span>

                        <h1 className="max-w-[680px] font-heading text-[44px] font-extrabold leading-[1.08] tracking-[-0.04em] text-app-text md:text-[64px]">
                            Alquila equipo en <br /> <span className="italic text-vecilend-dark-primary">3 sencillos pasos.</span>
                        </h1>

                        <p className="mt-6 max-w-[600px] font-body text-body-base leading-body text-app-text-secondary md:text-[18px]">
                            Evita grandes inversiones y costosos mantenimientos. Accede a cámaras de cine profesionales, drones de gran altitud y kits de iluminación de fabricantes de confianza en tu comunidad.
                        </p>

                        <div className="mt-8">
                            <Link to="/objects" className="inline-flex items-center justify-center rounded-[16px] bg-vecilend-dark-primary px-8 py-4 font-body text-body-base font-bold text-vecilend-dark-bg shadow-xl shadow-vecilend-dark-primary/20 transition-all hover:scale-[1.02] hover:bg-vecilend-dark-primary-hover active:scale-95">Comienza a explorar</Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative top-12 left-12 w-lg h-lg rounded-xl overflow-hidden aspect-square shadow-2xl rotate-2">
                            <img 
                                className="w-full h-full object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyU7hmxQm00CFgMF44iEFBuUyj7ogOaEHQw8K9Q4tMLYNsGx1rc6YTktw4k3hgbvXjBNg4IlONZBHiCslIvMvOa-QyVSBT06PoiCClY7orjB_Q7K_XwSe16dYNbXrEE6D5d7s01WsFZ9TLGifgYMmsSceE3IiAnyx2z6TC7mAYf3klrIYB-GoZVlbT8mnyIUQVOFfCqLV2SDEYSdJmJQ6rvGlZsbeTQHxCL3C76mVaZR4mpK3QsJ5hSUMQsK74_6Dc3P4BOKNNKGAm" 
                                alt="Professional photographer" 
                            />
                        </div>
                        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-xl overflow-hidden shadow-xl -rotate-6 z-0 md:block hidden border border-[#3c4947]">
                            <img 
                                className="w-full h-full object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmXWEnxVv2uZu7wXMwqcf-jdzJ9JCofZllkQjlSQqIJCE6bIelB3UrxxKr_IB4fBg69koNtd8o9ZwkXJn9TVn2a0pmeyvZRnaLod_do2yiuTB7asy2NiW-GCFDUZcLA71tih5-_qO1JUH43Xj2fH2u197umC8tSCyV0X9xC96sPZK9ObBCyPXZvS6N6J_6_NKsZXGFLDBFIwisRpNB1WL3lxLkT8uVqevEgyBLXX3qVCOM2EppAIHumhYcqKgOzuYcc2sG4Fl_4jx-" 
                                alt="Drone" 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 bg-app-bg-secondary">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-extrabold mb-4 text-[#dde4e1]">The Creative Workflow</h2>
                        <p className="text-[#bbcac6] max-w-xl mx-auto">From inspiration to completion, we've streamlined the logistics so you can focus on your art.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="group bg-vecilend-dark-bg p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300 border border-vecilend-dark-border">
                            <div className="w-16 h-16 rounded-2xl bg-vecilend-dark-primary/20 flex items-center justify-center text-vecilend-dark-primary mb-8 group-hover:bg-vecilend-dark-primary group-hover:text-vecilend-dark-bg transition-colors">
                                <span className="material-symbols-outlined text-4xl">search</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-vecilend-dark-text">1. Browse</h3>
                            <p className="text-vecilend-dark-text-secondary leading-relaxed">
                                Discover high-end gear from local professionals. Filter by brand, focal length, or pickup proximity to find exactly what your project needs.
                            </p>
                        </div>
                        {/* Step 2 */}
                        <div className="group bg-vecilend-dark-bg p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300 border border-vecilend-dark-border">
                            <div className="w-16 h-16 rounded-2xl bg-vecilend-dark-primary/20 flex items-center justify-center text-vecilend-dark-primary mb-8 group-hover:bg-vecilend-dark-primary group-hover:text-vecilend-dark-bg transition-colors">
                                <span className="material-symbols-outlined text-4xl">calendar_today</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-vecilend-dark-text">2. Book</h3>
                            <p className="text-vecilend-dark-text-secondary leading-relaxed">
                                Select your dates, message the owner with questions, and secure your booking with our integrated Fluid Insurance coverage in just a few clicks.
                            </p>
                        </div>
                        {/* Step 3 */}
                        <div className="group bg-vecilend-dark-bg p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300 border border-vecilend-dark-border">
                            <div className="w-16 h-16 rounded-2xl bg-vecilend-dark-primary/20 flex items-center justify-center text-vecilend-dark-primary mb-8 group-hover:bg-vecilend-dark-primary group-hover:text-vecilend-dark-bg transition-colors">
                                <span className="material-symbols-outlined text-4xl">movie</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-vecilend-dark-text">3. Create</h3>
                            <p className="text-vecilend-dark-text-secondary leading-relaxed">
                                Pick up your gear from a friendly peer, shoot your masterpiece, and return it with a review. Your creative journey starts here.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Rent with Us? (Bento Style) */}
            <section className="py-24 px-8 max-w-7xl mx-auto">
                <h2 className="text-4xl font-extrabold mb-12 text-center text-[#dde4e1]">Why Rent with Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Large Feature */}
                    <div className="md:col-span-8 bg-[#090f0e] rounded-lg p-10 flex flex-col md:flex-row gap-8 items-center overflow-hidden border border-[#3c4947]">
                        <div className="flex-1">
                            <span className="text-[#4fdbc8] font-bold tracking-widest text-xs uppercase mb-2 block">Peace of Mind</span>
                            <h3 className="text-3xl font-bold mb-4 text-[#dde4e1]">Comprehensive Insurance</h3>
                            <p className="text-[#bbcac6] mb-6">Our 'Fluid Care' insurance is baked into every rental. Whether it's a minor scratch or a technical failure, we've got your back so you can focus on the frame.</p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-[#dde4e1] font-medium">
                                    <span className="material-symbols-outlined text-[#4fdbc8]">check_circle</span> Instant Damage Protection
                                </li>
                                <li className="flex items-center gap-3 text-[#dde4e1] font-medium">
                                    <span className="material-symbols-outlined text-[#4fdbc8]">check_circle</span> Low Deductibles
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full h-full min-h-[300px] rounded-lg overflow-hidden">
                            <img 
                                className="w-full h-full object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsYtm2Bh5NvRJvkBUkLJxCetu71iSVpb6t8GuzS59_D74qO2AssJ27n2qmbb_Dw_MoGrts_yQRgP6VxVM1wRaN8s364hat5E6tdtQYoTi2mb494ez3xNDDzDvr63qeER7ieIIlM0vQIZkpCdASyzflMHV_a4SF4Ab7I_qlBEMc-16f3M1IENieqLl6neyzrEwHX1jlhWosqshE2pDxSdYu7PYYXO1GwNvdmi5bBBFSqluqoGzGmW6SsH55xWGGn-VT9EQG1HkZPQeX" 
                                alt="Camera lens cleaning" 
                            />
                        </div>
                    </div>

                    {/* Small Feature 1 */}
                    <div className="md:col-span-4 bg-[#4fdbc8] text-[#003731] rounded-lg p-10 flex flex-col justify-between">
                        <div>
                            <span className="material-symbols-outlined text-5xl mb-6">verified_user</span>
                            <h3 className="text-2xl font-bold mb-4">Community Trust</h3>
                            <p className="text-[#003731]/80">Every lender and renter is verified through a multi-step ID check and community ratings system.</p>
                        </div>
                        <Link to="#" className="mt-8 font-bold flex items-center gap-2 group">
                            Learn about Safety <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                        </Link>
                    </div>

                    {/* Small Feature 2 */}
                    <div className="md:col-span-4 bg-[#21514a] text-[#92c2b8] rounded-lg p-10">
                        <span className="material-symbols-outlined text-5xl mb-6">savings</span>
                        <h3 className="text-2xl font-bold mb-4">Elite Gear, Entry Prices</h3>
                        <p className="text-[#92c2b8]/80 font-medium">Access $50,000 cinema rigs for a few hundred dollars. High-end creation is finally accessible.</p>
                    </div>

                    {/* Small Feature 3 */}
                    <div className="md:col-span-8 bg-[#252b2a] border border-[#3c4947] rounded-lg p-10 flex items-center gap-8">
                        <div className="hidden sm:block w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                                className="w-full h-full object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlAXFnt4UOKXh8eQSKmLUTGrOqNIwwMppz0M8VlWHh8MCxZkl3SHAm5vZ_58AyIook1a-Nuk8riEUlFvG6UX-NBROSyK24fqM5HQv8PBaDW1RNPgfyhjsaN7Nk2qxik3ea86nzfplAe68D1c89YSAq50ygjxO4q47fICcrfu4r6rgXotw_Cfo67v6l6gPqyw81xxmQDaJv0apKeS26VGqPgY_IwFpeY18QAvSebjU6egRg6btaW94uNQmv0EPWaHlpO7Diqr4_urPL" 
                                alt="Creator support" 
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2 text-[#dde4e1]">Concierge Support</h3>
                            <p className="text-[#bbcac6]">Need help choosing the right gimbal? Or can't find a specific adapter? Our real-human concierge team is here 24/7 to help you navigate the marketplace.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-[#0e1513]">
                <div className="max-w-4xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold mb-4 text-[#dde4e1]">Got Questions?</h2>
                        <p className="text-[#bbcac6]">Everything you need to know about starting your first rental.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-[#161d1b] border border-[#3c4947] rounded-lg overflow-hidden transition-all duration-300">
                            <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#252b2a] transition-colors text-[#dde4e1]">
                                <span className="font-bold text-lg">What happens if I accidentally damage the gear?</span>
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                        <div className="bg-[#161d1b] border border-[#3c4947] rounded-lg overflow-hidden transition-all duration-300">
                            <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#252b2a] transition-colors text-[#dde4e1]">
                                <span className="font-bold text-lg">How do pick-ups and drop-offs work?</span>
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                        <div className="bg-[#161d1b] border border-[#3c4947] rounded-lg overflow-hidden transition-all duration-300">
                            <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#252b2a] transition-colors text-[#dde4e1]">
                                <span className="font-bold text-lg">Is there a security deposit required?</span>
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                        <div className="bg-[#161d1b] border border-[#3c4947] rounded-lg overflow-hidden transition-all duration-300">
                            <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#252b2a] transition-colors text-[#dde4e1]">
                                <span className="font-bold text-lg">Can I rent gear for a shoot in another city?</span>
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-8 py-12">
                <div className="max-w-7xl mx-auto bg-[#4fdbc8] rounded-xl p-12 md:p-20 relative overflow-hidden text-center text-[#003731]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0047b7] to-[#4fdbc8] opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 max-w-2xl mx-auto">Ready to bring your vision to life?</h2>
                        <p className="text-xl text-[#003731]/80 mb-12 max-w-xl mx-auto">Join thousands of creators who are already saving money and making better content with Fluid.</p>
                        <button className="bg-[#090f0e] text-[#4fdbc8] px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
                            Start Browsing Gear
                        </button>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </section>
        </div>
    );
}

export default HowItWorksPage;

// import React from 'react';
// import { Link } from 'react-router-dom';

// function HowItWorksPage() {
//     return (
//         <>
//             <section className="relative w-full overflow-hidden py-12 md:py-20">
//                 <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
//                     <div className="relative z-10">
//                         <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffc5a4] text-[#763500] text-sm font-bold mb-6">Rent with Confidence</span>

//                         <h1 className="max-w-[680px] font-heading text-[44px] font-extrabold leading-[1.08] tracking-[-0.04em] text-app-text md:text-[64px]">
//                             Alquila equipo en  <br /> <span className="text-vecilend-dark-primary">3 sencillos pasos.</span>
//                         </h1>

//                         <p className="mt-6 max-w-[600px] font-body text-body-base leading-body text-app-text-secondary md:text-[18px]">
//                             Evita grandes inversiones y costosos mantenimientos. Accede a cámaras de cine 
//                             profesionales, drones de gran altitud y kits de iluminación de fabricantes de confianza 
//                             en tu comunidad.
//                         </p>

//                         <div className="mt-8 flex flex-col gap-4 sm:flex-row">
//                             <Link to="/objects" className="inline-flex items-center justify-center rounded-[16px] bg-vecilend-dark-primary px-8 py-4 font-body text-body-base font-bold text-vecilend-dark-bg shadow-xl shadow-vecilend-dark-primary/20 transition-all hover:scale-[1.02] hover:bg-vecilend-dark-primary-hover active:scale-95">Comienza a explorar</Link>
//                         </div>
//                     </div>

//                     <div className="relative">
//                         <div className="relative grid grid-cols-2 gap-4">
//                             <div className="space-y-4">
//                                 <div className="overflow-hidden rounded-[18px] border border-app-border shadow-2xl shadow-black/30">
//                                     <img src="/assets/img1-hero-section.png" alt="Vecinos compartiendo objetos" className="h-[190px] w-full object-cover opacity-90"/>
//                                 </div>

//                                 <div className="translate-x-4 overflow-hidden rounded-[18px] border border-app-border shadow-2xl shadow-black/30">
//                                     <img src="/assets/img2-hero-section.png" alt="Herramientas disponibles para alquilar" className="h-[260px] w-full object-cover opacity-90" />
//                                 </div>
//                             </div>

//                             <div className="space-y-4 pt-8">
//                                 <div className="-translate-x-4 overflow-hidden rounded-[18px] border border-app-border shadow-2xl shadow-black/30">
//                                     <img src="/assets/img3-hero-section.png" alt="Bicicleta disponible para alquilar" className="h-[260px] w-full object-cover opacity-90" />
//                                 </div>

//                                 <div className="overflow-hidden rounded-[18px] border border-app-border shadow-2xl shadow-black/30">
//                                     <img src="/assets/img4-hero-section.png" alt="Cámara disponible para alquilar" className="h-[190px] w-full object-cover opacity-90" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <section>
//                 <div className="max-w-7xl mx-auto px-6">
//                     <div className='mb-8'>
//                         <h2 className="font-inter text-3xl font-extrabold tracking-tight text-app-text mb-2">El flujo de trabajo creativo</h2>
//                         <p className='text-app-text-secondary'>Desde la inspiración hasta la finalización, hemos simplificado la logística para que puedas concentrarte en tu arte.</p>
//                     </div>
//                     <div className="flex gap-6">
//                         <div className="group bg-[#ffffff] p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300">
//                             <div className="w-16 h-16 rounded-2xl bg-[#799dff]/20 flex items-center justify-center text-[#0052d0] mb-8 group-hover:bg-[#0052d0] group-hover:text-[#f1f2ff] transition-colors">
//                                 <span className="material-symbols-outlined text-4xl">search</span>
//                             </div>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-4 text-[#272b51]">1. Browse</h3>
//                             <p className="text-[#545881] leading-relaxed">
//                                 Discover high-end gear from local professionals. Filter by brand, focal length, or pickup proximity to find exactly what your project needs.
//                             </p>
//                         </div>

//                         <div className="group bg-[#ffffff] p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300">
//                             <div className="w-16 h-16 rounded-2xl bg-[#ffc5a4]/20 flex items-center justify-center text-[#954400] mb-8 group-hover:bg-[#954400] group-hover:text-[#fff0e9] transition-colors">
//                                 <span className="material-symbols-outlined text-4xl">calendar_today</span>
//                             </div>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-4 text-[#272b51]">2. Book</h3>
//                             <p className="text-[#545881] leading-relaxed">
//                                 Select your dates, message the owner with questions, and secure your booking with our integrated Fluid Insurance coverage in just a few clicks.
//                             </p>
//                         </div>

//                         <div className="group bg-[#ffffff] p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300">
//                             <div className="w-16 h-16 rounded-2xl bg-[#60fcc6]/20 flex items-center justify-center text-[#00694d] mb-8 group-hover:bg-[#00694d] group-hover:text-[#c7ffe4] transition-colors">
//                                 <span className="material-symbols-outlined text-4xl">movie</span>
//                             </div>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-4 text-[#272b51]">3. Create</h3>
//                             <p className="text-[#545881] leading-relaxed">
//                                 Pick up your gear from a friendly peer, shoot your masterpiece, and return it with a review. Your creative journey starts here.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Process Section */}
//             <section className="py-24">
//                 <div className="max-w-7xl mx-auto px-8">
//                     <div className="text-center mb-20">
//                         <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold mb-4 text-[#272b51]">The Creative Workflow</h2>
//                         <p className="text-[#545881] max-w-xl mx-auto">From inspiration to completion, we've streamlined the logistics so you can focus on your art.</p>
//                     </div>
//                     <div className="grid md:grid-cols-3 gap-8 relative">
//                         {/* Step 1 */}
//                         <div className="group bg-[#ffffff] p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300">
//                             <div className="w-16 h-16 rounded-2xl bg-[#799dff]/20 flex items-center justify-center text-[#0052d0] mb-8 group-hover:bg-[#0052d0] group-hover:text-[#f1f2ff] transition-colors">
//                                 <span className="material-symbols-outlined text-4xl">search</span>
//                             </div>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-4 text-[#272b51]">1. Browse</h3>
//                             <p className="text-[#545881] leading-relaxed">
//                                 Discover high-end gear from local professionals. Filter by brand, focal length, or pickup proximity to find exactly what your project needs.
//                             </p>
//                         </div>
//                         {/* Step 2 */}
//                         <div className="group bg-[#ffffff] p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300">
//                             <div className="w-16 h-16 rounded-2xl bg-[#ffc5a4]/20 flex items-center justify-center text-[#954400] mb-8 group-hover:bg-[#954400] group-hover:text-[#fff0e9] transition-colors">
//                                 <span className="material-symbols-outlined text-4xl">calendar_today</span>
//                             </div>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-4 text-[#272b51]">2. Book</h3>
//                             <p className="text-[#545881] leading-relaxed">
//                                 Select your dates, message the owner with questions, and secure your booking with our integrated Fluid Insurance coverage in just a few clicks.
//                             </p>
//                         </div>
//                         {/* Step 3 */}
//                         <div className="group bg-[#ffffff] p-10 rounded-lg hover:translate-y-[-8px] transition-all duration-300">
//                             <div className="w-16 h-16 rounded-2xl bg-[#60fcc6]/20 flex items-center justify-center text-[#00694d] mb-8 group-hover:bg-[#00694d] group-hover:text-[#c7ffe4] transition-colors">
//                                 <span className="material-symbols-outlined text-4xl">movie</span>
//                             </div>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-4 text-[#272b51]">3. Create</h3>
//                             <p className="text-[#545881] leading-relaxed">
//                                 Pick up your gear from a friendly peer, shoot your masterpiece, and return it with a review. Your creative journey starts here.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Why Rent with Us? (Bento Style) */}
//             <section className="py-24 px-8 max-w-7xl mx-auto">
//                 <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold mb-12 text-center text-[#272b51]">Why Rent with Us?</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                     {/* Large Feature */}
//                     <div className="md:col-span-8 bg-[#ffffff] rounded-lg p-10 flex flex-col md:flex-row gap-8 items-center overflow-hidden">
//                         <div className="flex-1">
//                             <span className="text-[#0052d0] font-bold tracking-widest text-xs uppercase mb-2 block">Peace of Mind</span>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-3xl font-bold mb-4 text-[#272b51]">Comprehensive Insurance</h3>
//                             <p className="text-[#545881] mb-6">Our 'Fluid Care' insurance is baked into every rental. Whether it's a minor scratch or a technical failure, we've got your back so you can focus on the frame.</p>
//                             <ul className="space-y-3">
//                                 <li className="flex items-center gap-3 text-[#272b51] font-medium">
//                                     <span className="material-symbols-outlined text-[#0052d0]">check_circle</span> Instant Damage Protection
//                                 </li>
//                                 <li className="flex items-center gap-3 text-[#272b51] font-medium">
//                                     <span className="material-symbols-outlined text-[#0052d0]">check_circle</span> Low Deductibles
//                                 </li>
//                             </ul>
//                         </div>
//                         <div className="flex-1 w-full h-full min-h-[300px] rounded-lg overflow-hidden">
//                             <img 
//                                 className="w-full h-full object-cover" 
//                                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsYtm2Bh5NvRJvkBUkLJxCetu71iSVpb6t8GuzS59_D74qO2AssJ27n2qmbb_Dw_MoGrts_yQRgP6VxVM1wRaN8s364hat5E6tdtQYoTi2mb494ez3xNDDzDvr63qeER7ieIIlM0vQIZkpCdASyzflMHV_a4SF4Ab7I_qlBEMc-16f3M1IENieqLl6neyzrEwHX1jlhWosqshE2pDxSdYu7PYYXO1GwNvdmi5bBBFSqluqoGzGmW6SsH55xWGGn-VT9EQG1HkZPQeX" 
//                                 alt="Camera lens cleaning" 
//                             />
//                         </div>
//                     </div>

//                     {/* Small Feature 1 */}
//                     <div className="md:col-span-4 bg-[#0052d0] text-[#f1f2ff] rounded-lg p-10 flex flex-col justify-between">
//                         <div>
//                             <span className="material-symbols-outlined text-5xl mb-6">verified_user</span>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-4">Community Trust</h3>
//                             <p className="text-[#f1f2ff]/80">Every lender and renter is verified through a multi-step ID check and community ratings system.</p>
//                         </div>
//                         <Link to="#" className="mt-8 font-bold flex items-center gap-2 group">
//                             Learn about Safety <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
//                         </Link>
//                     </div>

//                     {/* Small Feature 2 */}
//                     <div className="md:col-span-4 bg-[#ffc5a4] text-[#763500] rounded-lg p-10">
//                         <span className="material-symbols-outlined text-5xl mb-6">savings</span>
//                         <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-4">Elite Gear, Entry Prices</h3>
//                         <p className="text-[#763500]/80 font-medium">Access $50,000 cinema rigs for a few hundred dollars. High-end creation is finally accessible.</p>
//                     </div>

//                     {/* Small Feature 3 */}
//                     <div className="md:col-span-8 bg-[#dfe0ff] rounded-lg p-10 flex items-center gap-8">
//                         <div className="hidden sm:block w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
//                             <img 
//                                 className="w-full h-full object-cover" 
//                                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlAXFnt4UOKXh8eQSKmLUTGrOqNIwwMppz0M8VlWHh8MCxZkl3SHAm5vZ_58AyIook1a-Nuk8riEUlFvG6UX-NBROSyK24fqM5HQv8PBaDW1RNPgfyhjsaN7Nk2qxik3ea86nzfplAe68D1c89YSAq50ygjxO4q47fICcrfu4r6rgXotw_Cfo67v6l6gPqyw81xxmQDaJv0apKeS26VGqPgY_IwFpeY18QAvSebjU6egRg6btaW94uNQmv0EPWaHlpO7Diqr4_urPL" 
//                                 alt="Creator support" 
//                             />
//                         </div>
//                         <div>
//                             <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-2 text-[#272b51]">Concierge Support</h3>
//                             <p className="text-[#545881]">Need help choosing the right gimbal? Or can't find a specific adapter? Our real-human concierge team is here 24/7 to help you navigate the marketplace.</p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* FAQ Section */}
//             <section className="py-24 bg-[#f8f5ff]">
//                 <div className="max-w-4xl mx-auto px-8">
//                     <div className="text-center mb-16">
//                         <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold mb-4 text-[#272b51]">Got Questions?</h2>
//                         <p className="text-[#545881]">Everything you need to know about starting your first rental.</p>
//                     </div>
//                     <div className="space-y-4">
//                         <div className="bg-[#f1efff] rounded-lg overflow-hidden transition-all duration-300">
//                             <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#dfe0ff] transition-colors text-[#272b51]">
//                                 <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg">What happens if I accidentally damage the gear?</span>
//                                 <span className="material-symbols-outlined">add</span>
//                             </button>
//                         </div>
//                         <div className="bg-[#f1efff] rounded-lg overflow-hidden transition-all duration-300">
//                             <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#dfe0ff] transition-colors text-[#272b51]">
//                                 <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg">How do pick-ups and drop-offs work?</span>
//                                 <span className="material-symbols-outlined">add</span>
//                             </button>
//                         </div>
//                         <div className="bg-[#f1efff] rounded-lg overflow-hidden transition-all duration-300">
//                             <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#dfe0ff] transition-colors text-[#272b51]">
//                                 <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg">Is there a security deposit required?</span>
//                                 <span className="material-symbols-outlined">add</span>
//                             </button>
//                         </div>
//                         <div className="bg-[#f1efff] rounded-lg overflow-hidden transition-all duration-300">
//                             <button className="w-full flex items-center justify-between p-6 text-left hover:bg-[#dfe0ff] transition-colors text-[#272b51]">
//                                 <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg">Can I rent gear for a shoot in another city?</span>
//                                 <span className="material-symbols-outlined">add</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* CTA Section */}
//             <section className="px-8 py-12">
//                 <div className="max-w-7xl mx-auto bg-[#0052d0] rounded-xl p-12 md:p-20 relative overflow-hidden text-center text-[#f1f2ff]">
//                     <div className="absolute inset-0 bg-gradient-to-tr from-[#0047b7] to-[#0052d0] opacity-50"></div>
//                     <div className="relative z-10">
//                         <h2 className="font-['Plus_Jakarta_Sans'] text-4xl md:text-5xl font-extrabold mb-8 max-w-2xl mx-auto">Ready to bring your vision to life?</h2>
//                         <p className="text-xl text-[#f1f2ff]/80 mb-12 max-w-xl mx-auto">Join thousands of creators who are already saving money and making better content with Fluid.</p>
//                         <button className="bg-[#ffffff] text-[#0052d0] px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
//                             Start Browsing Gear
//                         </button>
//                     </div>
//                     {/* Decorative Elements */}
//                     <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
//                     <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
//                 </div>
//             </section>
//         </>
//     );
// }

// export default HowItWorksPage;