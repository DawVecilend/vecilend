import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProfile } from '../services/profile';
import { AuthContext } from '../contexts/AuthContext';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const isOwnProfile = currentUser && currentUser.username === username;

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile(username);
        setProfile(response);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setProfile(null);
      }
    }

    loadProfile();
  }, [username]);

  return (
    <div className="bg-[#0e1513] text-[#dde4e1] antialiased min-h-screen dark">
      <main className="pt-28 pb-12 px-4 max-w-7xl mx-auto space-y-24">
        <section className="relative bg-[#161d1b] rounded-xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <span className="material-symbols-outlined !text-[20rem] text-[#4fdbc8] rotate-12">camera_enhance</span>
          </div>
          <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative group">
              <img
                alt="Foto de perfil"
                className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-2xl scale-105 group-hover:scale-100 transition-transform duration-500" 
                src={profile?.avatar_url || '/assets/icons/empty-user-icon.svg'}
              />
              <div className="absolute -bottom-3 -right-3 bg-[#f38764] text-[#6c2106] px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border border-white">
                <span className="material-symbols-outlined icon-filled text-sm">verified</span>
                Verificado
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#dde4e1] tracking-tight">{profile?.nom} {profile?.cognoms}</h1>
                <p className="flex items-center gap-1 text-[#bbcac6] font-medium mt-1">
                  <span className="material-symbols-outlined !text-lg">location_on</span>
                  {profile?.direccio || 'Ubicación no disponible'}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-[#090f0e] px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-[#4fdbc8] font-bold text-xl">350+</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#859490]">Alquileres</span>
                </div>
                <div className="bg-[#090f0e] px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-[#4fdbc8] font-bold text-xl">100%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#859490]">Respuesta</span>
                </div>
                <div className="bg-[#090f0e] px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[100px]">
                  <div className="flex items-center gap-1">
                    <span className="text-[#4fdbc8] font-bold text-xl">4.9</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-sm">star</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#859490]">Puntuación</span>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                {isOwnProfile ? (
                  <Link 
                    to={`/settings/profile/${username}/editing`}
                    className="bg-gradient-to-br from-[#4fdbc8] to-[#14b8a6] text-[#003731] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[#4fdbc8]/25 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined !text-xl">edit</span>
                    Editar Perfil
                  </Link>
                ) : (
                  <>
                    <button className="bg-gradient-to-br from-[#4fdbc8] to-[#14b8a6] text-[#003731] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[#4fdbc8]/25 active:scale-95 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined !text-xl">mail</span>
                      Contacta a {profile?.nom}
                    </button>
                    <button className="bg-[#21514a] text-[#92c2b8] px-8 py-4 rounded-full font-bold hover:bg-[#bbece2] transition-colors active:scale-95">
                      Seguir
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-[#090f0e] p-8 rounded-lg space-y-6">
            <h2 className="text-2xl font-bold text-[#4fdbc8]">Acerca de {profile?.nom}</h2>
            <div className="space-y-4 text-[#bbcac6] leading-relaxed">
              <p>{profile?.biography || 'Descripción no disponible'}</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="bg-[#252b2a] px-4 py-2 rounded-full text-sm font-semibold">Cinematography</span>
              <span className="bg-[#252b2a] px-4 py-2 rounded-full text-sm font-semibold">Color Grading</span>
              <span className="bg-[#252b2a] px-4 py-2 rounded-full text-sm font-semibold">Technical Advisor</span>
            </div>
          </div>
          <div className="md:col-span-4 bg-[#4fdbc8] text-[#003731] p-8 rounded-lg relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-20 transform group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined !text-[12rem]">verified_user</span>
            </div>
            <h3 className="text-xl font-bold mb-6">Lender Commitment</h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined icon-filled text-[#ffdbd0]">check_circle</span>
                <p className="text-sm font-medium">Same-day inspection on all returns</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined icon-filled text-[#ffdbd0]">check_circle</span>
                <p className="text-sm font-medium">Sensor cleaning before every body rental</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined icon-filled text-[#ffdbd0]">check_circle</span>
                <p className="text-sm font-medium">Firmware kept up to date monthly</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined icon-filled text-[#ffdbd0]">check_circle</span>
                <p className="text-sm font-medium">Flexible pickup in Williamsburg</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#dde4e1]">Currently Listing</h2>
              <p className="text-[#bbcac6] mt-1">14 professional film kits available now</p>
            </div>
            <Link to={`/profile/${profile?.username}/objects`} className="text-[#4fdbc8] font-bold text-sm flex items-center gap-1 hover:underline">
              View All Gear <span className="material-symbols-outlined !text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-[#090f0e] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  alt="Sony A7 IV"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCVZKePoBsHIMyfa2kUKTDD0ZqZS5nRXTvkEdrfH_QZXgIkIRusDKwwfPKXBN0xtApGy4efudWoQXV3OvufyCVksmLdqdjz5BOIov0LmMLPLBlbEdeNCwJyhK1x8h6wliY5zHfiZvOXSS5LTxjPNlLI7aR07B3pi5DMvJSqm0zTPL8IxFovJ2z3KAsqB3eIQUX03dSgvUqwax1kolHF9f9P0sD9hO946e7nVUkR8Y2DgZwHBcD-1uoVHnsOb1khAmF7G69foNPLyIv"
                />
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#4fdbc8] flex items-center gap-1">
                  <span className="material-symbols-outlined icon-filled text-sm">bolt</span>
                  Top Pick
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-[#dde4e1]">Sony A7 IV Cinema Kit</h3>
                    <span className="text-[#4fdbc8] font-bold">$85<span className="text-xs text-[#bbcac6] font-normal">/day</span></span>
                  </div>
                  <p className="text-sm text-[#bbcac6] mt-2 line-clamp-2 italic">Full kit including 24-70mm GM II lens, 4 batteries, and 2x 160GB CFexpress cards.</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#1a211f]">
                  <span className="material-symbols-outlined icon-filled text-orange-500 text-sm">star</span>
                  <span className="text-xs font-bold text-[#dde4e1]">4.9</span>
                  <span className="text-xs text-[#859490]">(42 reviews)</span>
                </div>
              </div>
            </div>
            <div className="group bg-[#090f0e] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  alt="DJI Mavic 3 Pro"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOaN20-_BcbW-bZYIHJADUt3RrR2HTmVWFJ0fReOH_KLFPNMqMBu0xn_R7BXuUWXWjob5QsJQ6cLbRfC4MRdgyIFgjYk6qFkbbMohJtT_Y2OCCzoSGdy0dcyIDB1CHvHOmjcNehnAWSJxZwYqGgHS-p5trI-fOMIGIdAflIVdZPdosb3hYdNhFdA1nFDd4g8mTDxMd4CyEsrJAqA3zCJv2LRrOoumzrg446B8iNHj_UDZVyHKqvASzTWi72vL2P6DmcA_pivh1cQhH"
                />
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-[#dde4e1]">DJI Mavic 3 Pro (Cine)</h3>
                    <span className="text-[#4fdbc8] font-bold">$120<span className="text-xs text-[#bbcac6] font-normal">/day</span></span>
                  </div>
                  <p className="text-sm text-[#bbcac6] mt-2 line-clamp-2 italic">Triple camera system with ND filter set and RC Pro controller. Pro-ready.</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#1a211f]">
                  <span className="material-symbols-outlined icon-filled text-orange-500 text-sm">star</span>
                  <span className="text-xs font-bold text-[#dde4e1]">5.0</span>
                  <span className="text-xs text-[#859490]">(18 reviews)</span>
                </div>
              </div>
            </div>
            <div className="group bg-[#090f0e] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  alt="Aputure 600d Pro"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxjeCKNL2rJfYg_IUfEOCc_wQlzTwKqvbAiGSfUZxn9-HzIP8bex0ZtoGbTnoL5pzdVVuJkwK7juJ6MlyOWg7d9oG2hXlV-USDehpJsp__vJP5O2j0QIlIp6V3ec59DVwjQXyZB37d5zSis4gT4DGm13UTSfI_VY0ddl6R8H3i5IKHsx0aeb1wvz0iuHjlwBZQ5IHwKNKIcw64PDaRON8A9zb7GEHhOtJQ1HW5RZf8ftnvb9WoT0iyZJSOAaLxDK3kxyPI_i_A_m1e"
                />
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-[#dde4e1]">Aputure 600d Pro Kit</h3>
                    <span className="text-[#4fdbc8] font-bold">$95<span className="text-xs text-[#bbcac6] font-normal">/day</span></span>
                  </div>
                  <p className="text-sm text-[#bbcac6] mt-2 line-clamp-2 italic">Weather-resistant high output LED. Includes F10 Fresnel and light stand.</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#1a211f]">
                  <span className="material-symbols-outlined icon-filled text-orange-500 text-sm">star</span>
                  <span className="text-xs font-bold text-[#dde4e1]">4.8</span>
                  <span className="text-xs text-[#859490]">(29 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#dde4e1]">Reviews from Filmmakers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#161d1b] p-8 rounded-lg space-y-4 border-l-4 border-[#4fdbc8]">
              <div className="flex items-center gap-4">
                <img
                  alt="User Profile"
                  className="w-12 h-12 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeEqSaikQJZ9NyhaeByH7mNkoQaDgO_9cyQiWUksGlDctNMV0--xgG-UcMBJDNVrQmfNQYR3YO8eTQDfBln6kVPTsnElbQkorJAiH6_aAihwvGCnhudhzqU6XC1THU08yyo9voih6Vizg0zdjS42_N9T-hMApuFRwzd_v_4wTRAmo-cKdTegtEhxYr9AdRK7l0qvDKlqFSuw_Ym7T3HaELXNjQNll5t_Uev_uYODmlCmfFw1eq3L5WB1iJCkjwFk8xRLvx8EVSiEdS"
                />
                <div>
                  <h4 className="font-bold text-[#dde4e1]">David S.</h4>
                  <div className="flex">
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                  </div>
                </div>
              </div>
              <p className="text-[#bbcac6] italic">"Marcus is the gold standard for gear rental. The A7 kit was immaculate, batteries were fully charged, and he even included extra lens tissues. Will definitely rent from him again!"</p>
            </div>
            <div className="bg-[#161d1b] p-8 rounded-lg space-y-4 border-l-4 border-[#4fdbc8]">
              <div className="flex items-center gap-4">
                <img
                  alt="User Profile"
                  className="w-12 h-12 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT73IMdFWPKHxMqksyR2MCl4XQcJ1X0CXN0AuGLaIsDsCXq-tuIibwjcU_1BmOGXse2LDOy66gcF2Hl92iZrf6wYHmnHIx-BVGUr6m7V3PIBsg5lD8qAdIuj14q2O8CgvgX85B6RYhiiQxfR249Gns_KiJi3cxwndjmI2YJ9FGoKj1xa0KSyRWgI4ZXYkPhhOeDYzLw_ktDwt04Bz3YMM-pT2XXwLfnEob_kDTsLlJeuH_J8Otfey4nZ6XiKlu-7IXA9y3wuikqzQZ"
                />
                <div>
                  <h4 className="font-bold text-[#dde4e1]">Sarah J.</h4>
                  <div className="flex">
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                    <span className="material-symbols-outlined icon-filled text-orange-500 text-xs">star</span>
                  </div>
                </div>
              </div>
              <p className="text-[#bbcac6] italic">"Communication was lightning fast. Picked up the Mavic 3 Pro for a commercial shoot in the city. Marcus gave me a quick rundown of the Cine features which was super helpful."</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;