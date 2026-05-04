import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HowItWorksRentersPage() {
    return (
        <div className="font-inter text-[#dde4e1] min-h-screen antialiased">
            <section className="relative w-full overflow-hidden py-12 md:py-20">
                <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
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

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link to="/objects" className="inline-flex items-center justify-center rounded-[16px] bg-vecilend-dark-primary px-8 py-4 font-body text-body-base font-bold text-vecilend-dark-bg shadow-xl shadow-vecilend-dark-primary/20 transition-all hover:scale-[1.02] hover:bg-vecilend-dark-primary-hover active:scale-95">Comienza a explorar</Link>
                            <Link to="/how-it-works/lenders" className="bg-[#252b2a] text-[#bbcac6] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#2f3634] transition-colors">¿Propietario?</Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative top-12 left-12 w-lg h-lg rounded-xl overflow-hidden aspect-square shadow-2xl rotate-2">
                            <img
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyU7hmxQm00CFgMF44iEFBuUyj7ogOaEHQw8K9Q4tMLYNsGx1rc6YTktw4k3hgbvXjBNg4IlONZBHiCslIvMvOa-QyVSBT06PoiCClY7orjB_Q7K_XwSe16dYNbXrEE6D5d7s01WsFZ9TLGifgYMmsSceE3IiAnyx2z6TC7mAYf3klrIYB-GoZVlbT8mnyIUQVOFfCqLV2SDEYSdJmJQ6rvGlZsbeTQHxCL3C76mVaZR4mpK3QsJ5hSUMQsK74_6Dc3P4BOKNNKGAm"
                                alt="Fotógrafo profesional"
                            />
                        </div>
                        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-xl overflow-hidden shadow-xl -rotate-6 z-0 md:block hidden border border-[#3c4947]">
                            <img
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmXWEnxVv2uZu7wXMwqcf-jdzJ9JCofZllkQjlSQqIJCE6bIelB3UrxxKr_IB4fBg69koNtd8o9ZwkXJn9TVn2a0pmeyvZRnaLod_do2yiuTB7asy2NiW-GCFDUZcLA71tih5-_qO1JUH43Xj2fH2u197umC8tSCyV0X9xC96sPZK9ObBCyPXZvS6N6J_6_NKsZXGFLDBFIwisRpNB1WL3lxLkT8uVqevEgyBLXX3qVCOM2EppAIHumhYcqKgOzuYcc2sG4Fl_4jx-"
                                alt="Dron"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 bg-app-bg-secondary">
                <div className="max-w-7xl mx-auto">
                    <div className=" mb-10">
                        <h2 className="text-4xl font-extrabold mb-4 text-[#dde4e1]">Tu Flujo de Alquiler</h2>
                        <p className="text-[#bbcac6]">Hemos simplificado la logística para que puedas disfrutar de tus actividades sin complicaciones.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="group bg-vecilend-dark-bg p-10 rounded-lg transition-all duration-300 border border-vecilend-dark-border">
                            <div className="w-16 h-16 rounded-2xl bg-vecilend-dark-primary/20 flex items-center justify-center text-vecilend-dark-primary mb-8 group-hover:bg-vecilend-dark-primary group-hover:text-vecilend-dark-bg transition-colors">
                                <span className="material-symbols-outlined text-4xl">category</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-vecilend-dark-text">1. Busca</h3>
                            <p className="text-vecilend-dark-text-secondary leading-relaxed">
                                Descubre miles de artículos de personas cerca de ti. Filtra por categoría, precio o proximidad para encontrar exactamente lo que buscas.
                            </p>
                        </div>
                        {/* Step 2 */}
                        <div className="group bg-vecilend-dark-bg p-10 rounded-lg transition-all duration-300 border border-vecilend-dark-border">
                            <div className="w-16 h-16 rounded-2xl bg-vecilend-dark-primary/20 flex items-center justify-center text-vecilend-dark-primary mb-8 group-hover:bg-vecilend-dark-primary group-hover:text-vecilend-dark-bg transition-colors">
                                <span className="material-symbols-outlined text-4xl">event_available</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-vecilend-dark-text">2. Reserva</h3>
                            <p className="text-vecilend-dark-text-secondary leading-relaxed">
                                Selecciona tus fechas, envía un mensaje al dueño con tus dudas y asegura tu reserva con nuestro sistema de pago y seguro integrado.
                            </p>
                        </div>
                        {/* Step 3 */}
                        <div className="group bg-vecilend-dark-bg p-10 rounded-lg transition-all duration-300 border border-vecilend-dark-border">
                            <div className="w-16 h-16 rounded-2xl bg-vecilend-dark-primary/20 flex items-center justify-center text-vecilend-dark-primary mb-8 group-hover:bg-vecilend-dark-primary group-hover:text-vecilend-dark-bg transition-colors">
                                <span className="material-symbols-outlined text-4xl">handshake</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-vecilend-dark-text">3. Disfruta</h3>
                            <p className="text-vecilend-dark-text-secondary leading-relaxed">
                                Recoge el artículo, úsalo para tu proyecto o aventura y devuélvelo al finalizar. ¡Es así de fácil compartir y ahorrar!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Rent with Us? (Bento Style) */}
            <section className="py-24 px-8 max-w-7xl mx-auto">
                <h2 className="text-4xl font-extrabold mb-12 text-center text-[#dde4e1]">¿Por qué alquilar con nosotros?</h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Large Feature */}
                    <div className="md:col-span-8 bg-[#090f0e] rounded-lg p-10 flex flex-col md:flex-row gap-8 items-center overflow-hidden border border-[#3c4947]">
                        <div className="flex-1">
                            <span className="text-[#4fdbc8] font-bold tracking-widest text-xs uppercase mb-2 block">Tranquilidad total</span>
                            <h3 className="text-3xl font-bold mb-4 text-[#dde4e1]">Seguro Todo Riesgo</h3>
                            <p className="text-[#bbcac6] mb-6">Nuestro seguro 'Fluid Care' está incluido en cada alquiler. Ya sea un pequeño golpe o una falla técnica, te protegemos para que uses el objeto sin miedo.</p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-[#dde4e1] font-medium">
                                    <span className="material-symbols-outlined text-[#4fdbc8]">check_circle</span> Protección contra daños instantánea
                                </li>
                                <li className="flex items-center gap-3 text-[#dde4e1] font-medium">
                                    <span className="material-symbols-outlined text-[#4fdbc8]">check_circle</span> Deducibles bajos
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full h-full min-h-[300px] rounded-lg overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtjxUxO4jCE1iisD2Vh_xeBuDy0nyHFcfsP--Yb9kIWMyqPonskPoLlHmgTO5RPka_VkFelsfxltO6mT6lO4GD3FXeJJmN39d-XCmiVyvi-Zd4eFCtGqbvdSqgv_4igxS5FGFWZIbR6dTN0MNomj4xKf-IhTtPHtA5RG-XahUqJa5pEkMjwlloNVEtMKqNONoaCHQS5N_3bZJLOHwtlrwCdnoCQKm3tMusM9sR9GDZapQJrwcmG-0SPSkMLDdG3poQ1okgF5FiHss8"
                                alt="Limpieza de lente de cámara"
                            />
                        </div>
                    </div>

                    {/* Small Feature 1 */}
                    <div className="md:col-span-4 bg-[#4fdbc8] text-[#003731] rounded-lg p-10 flex flex-col justify-between">
                        <div>
                            <span className="material-symbols-outlined text-5xl mb-6">eco</span>
                            <h3 className="text-2xl font-bold mb-4">Sustentabilidad</h3>
                            <p className="text-[#003731]/80">Alquilar en lugar de comprar reduce el desperdicio y fomenta una economía circular en tu comunidad local.</p>
                        </div>
                        <Link to="#" className="mt-8 font-bold flex items-center gap-2 group">
                            Saber más <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                        </Link>
                    </div>

                    {/* Small Feature 2 */}
                    <div className="md:col-span-4 bg-[#21514a] text-[#92c2b8] rounded-lg p-10">
                        <span className="material-symbols-outlined text-5xl mb-6">handshake</span>
                        <h3 className="text-2xl font-bold mb-4">Confianza Vecinal</h3>
                        <p className="text-[#92c2b8]/80 font-medium">Sistema de verificación de identidad y valoraciones reales para una experiencia 100% segura.</p>
                    </div>

                    {/* Small Feature 3 */}
                    <div className="md:col-span-8 bg-[#252b2a] border border-[#3c4947] rounded-lg p-10 flex items-center gap-8">
                        <div className="hidden sm:block w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
                            <img
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2UlTtZ_gUyfKKD5rf4E3dW56-02AN9t1VW3GqqnEKiHbl6ODrrfK8K-oDQQu5jSR4Cdh35a2p7WNoldsj2ki7qnHkmHqQptdBq890Og6W_onWBIM7ubmuWesSLYxIbSJMZHpV9yTaV9d5tNZTFh-NmBBdqajNWfP-Bx1jgKDbK9a3jgioBChldDogeAI09A0hlBWWoftPihdyFM-oXUcYuhQazm-8tb0cgcziVU8RULlYSs4mRSrK8Wxev4RgOV9rGU6j6h2gDxqN"
                                alt="Soporte al creador"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2 text-[#dde4e1]">Soporte 24/7</h3>
                            <p className="text-[#bbcac6]">¿No sabes cómo usar una herramienta o tienes problemas con la entrega? Nuestro equipo humano está listo para ayudarte en cualquier momento del día.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-8 md:px-24 bg-[#171d1b]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-inter text-4xl font-bold text-center mb-16 text-[#dee4e1]">Preguntas frecuentes</h2>
                    <div className="space-y-4">
                        <details className="group bg-[#0a0f0e] rounded-xl">
                            <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-[#dee4e1]">
                                ¿Qué pasa si accidentalmente daño el equipo?
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-[#bbcac6] leading-relaxed">
                                Si ocurre un daño accidental, revisa los términos del seguro incluido y ponte en contacto con el propietario. Nuestro equipo coordina la gestión para que el proceso sea claro y sin sorpresas.
                            </div>
                        </details>
                        <details className="group bg-[#0a0f0e] rounded-xl">
                            <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-[#dee4e1]">
                                ¿Cómo funcionan las recogidas y devoluciones?
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-[#bbcac6] leading-relaxed">
                                La recogida y devolución se acuerdan directamente con el propietario. Puedes usar la plataforma para enviar mensajes, fijar horarios y confirmar el punto de encuentro antes de tu reserva.
                            </div>
                        </details>
                        <details className="group bg-[#0a0f0e] rounded-xl">
                            <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-[#dee4e1]">
                                ¿Se requiere un depósito de seguridad?
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-[#bbcac6] leading-relaxed">
                                Algunos objetos pueden requerir un depósito según el acuerdo del propietario. Si aplica, lo verás al reservar y se mantiene bloqueado hasta la devolución en buen estado.
                            </div>
                        </details>
                        <details className="group bg-[#0a0f0e] rounded-xl">
                            <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-[#dee4e1]">
                                ¿Puedo alquilar artículos para llevarlos de viaje?
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-[#bbcac6] leading-relaxed">
                                Sí, puedes alquilar para viajar siempre que lo acuerdes con el dueño y respetes las reglas de transporte y seguro. Asegúrate de notificar cualquier destino especial antes de reservar.
                            </div>
                        </details>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-8 py-12">
                <div className="max-w-7xl mx-auto bg-[#4fdbc8] rounded-xl p-12 md:p-20 relative overflow-hidden text-center text-[#003731]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0047b7] to-[#4fdbc8] opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 max-w-2xl mx-auto">¿Listo para comenzar tu próxima aventura?</h2>
                        <p className="text-xl text-[#003731]/80 mb-12 max-w-xl mx-auto">Únete a miles de personas que ya están ahorrando dinero y cuidando el planeta compartiendo en lugar de comprar.</p>
                        <Link to="/objects" className="bg-[#090f0e] text-[#4fdbc8] px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
                            Explorar Ahora
                        </Link>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                </div>
            </section>
        </div>
    );
}

export default HowItWorksRentersPage;
