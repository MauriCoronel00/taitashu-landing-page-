import React from 'react';
import { Flame, Instagram, MapPin, Phone } from 'lucide-react';
import { BRANCHES, CENTRAL_WHATSAPP } from '../data/branchesData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070605] border-t border-[#1e1916] text-[#f5f2eb]/70 pt-16 pb-24 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="./assets/taitashu-logo.png"
                alt="TaitaShu Burgers"
                className="h-10 w-auto object-contain"
              />
              <span className="font-display text-2xl text-[#f5f2eb] tracking-wide">
                TAITASHU
              </span>
            </div>
            <p className="text-xs text-[#f5f2eb]/60 leading-relaxed">
              Hamburguesas smash al fuego real. Carne 100% vacuna prensada al hierro, queso cheddar fundido y pan brioche tostado. Nacidos en barrio desde 2017.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ff7a1a]">
              <Flame className="w-4 h-4 fill-[#ff7a1a]" />
              <span>La auténtica smash burger</span>
            </div>
          </div>

          {/* Col 2: Sucursales */}
          <div>
            <h4 className="font-display text-base text-[#f5f2eb] uppercase tracking-wider mb-4">
              Nuestras 5 Sucursales
            </h4>
            <ul className="space-y-2 text-xs">
              {BRANCHES.map((b) => (
                <li key={b.id} className="flex items-center justify-between">
                  <span className="font-medium text-white/80">{b.name}</span>
                  <span className="text-white/40 text-[11px]">{b.city}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Horarios & Atención */}
          <div>
            <h4 className="font-display text-base text-[#f5f2eb] uppercase tracking-wider mb-4">
              Horario & Pedidos
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-white/80">
                <strong className="text-[#ffb703] block">Lunes a Domingos:</strong>
                19:30 a 00:30 hs.
              </p>
              <p className="text-white/60">
                Atención directa para salón, retiro y delivery por WhatsApp en cada sucursal.
              </p>
              <a
                href={`https://wa.me/${CENTRAL_WHATSAPP}?text=Hola%20Taitashu%2C%20quiero%20hacer%20un%20pedido`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#25d366] font-bold mt-2 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Central: +595 994 223094</span>
              </a>
            </div>
          </div>

          {/* Col 4: Redes & Delivery */}
          <div>
            <h4 className="font-display text-base text-[#f5f2eb] uppercase tracking-wider mb-4">
              Seguinos en Redes
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-white/60">
                Enterate de las promos exclusivas, lanzamientos y fotos reales de la plancha.
              </p>
              <div className="flex gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#1e1916] hover:bg-[#2c2420] text-white flex items-center justify-center transition-colors border border-[#2b2420]"
                  aria-label="Instagram TaitaShu"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#1a1614] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#f5f2eb]/40">
          <p>© {new Date().getFullYear()} TaitaShu. Todos los derechos reservados. Gran Asunción, Paraguay.</p>
          <p>Hecho con fuego y pasión.</p>
        </div>
      </div>
    </footer>
  );
};
