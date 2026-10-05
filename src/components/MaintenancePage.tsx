import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageSquare, Lock, ArrowRight } from 'lucide-react';

interface MaintenancePageProps {
  brandNameLeft?: string;
  brandNameRight?: string;
  phone1?: string;
  showroomAddress?: string;
  onGoToAdmin?: () => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  brandNameLeft = 'Abed',
  brandNameRight = 'Furniture & Interior',
  phone1 = '০১৮১৬-২৩৪১৫৭',
  onGoToAdmin,
}) => {
  const cleanPhone = phone1.replace(/[^0-9+]/g, '');

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans selection:bg-amber-200 selection:text-amber-900 relative overflow-x-hidden">
      
      {/* ========================================================
          TOP SECTION: Clean White with Official Logo & Headings
          ======================================================== */}
      <div className="flex-1 flex flex-col items-center pt-8 sm:pt-12 px-4 relative z-10 max-w-4xl mx-auto w-full text-center">
        
        {/* Official Brand Logo matching the reference photo */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8 sm:mb-10 select-none cursor-default"
        >
          {/* Logo Graphic: Roof + Lamp + Sofa in brown/wood tone */}
          <div className="flex items-center gap-3">
            <svg 
              className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Roof outline */}
              <path 
                d="M15 52 L50 20 L85 52" 
                stroke="#9c5b28" 
                strokeWidth="7" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M50 20 L50 32" 
                stroke="#9c5b28" 
                strokeWidth="5" 
                strokeLinecap="round" 
              />
              <circle cx="50" cy="36" r="3" fill="#f57c00" />

              {/* Left Wall & Lamp stand */}
              <rect x="22" y="52" width="16" height="34" rx="2" fill="#6d3e16" />
              <line x1="30" y1="58" x2="30" y2="76" stroke="#fefefe" strokeWidth="2" />
              <polygon points="26,62 34,62 36,68 24,68" fill="#ffb74d" />

              {/* Sofa / Furniture piece inside */}
              <path 
                d="M44 64 H76 C79 64 81 66 81 69 V82 C81 84 79 86 76 86 H44 C41 86 39 84 39 82 V69 C39 66 41 64 44 64 Z" 
                fill="#ffffff" 
                stroke="#f57c00" 
                strokeWidth="4" 
              />
              <rect x="43" y="74" width="34" height="8" rx="2" fill="#ffb74d" />
              <rect x="42" y="86" width="6" height="4" rx="1" fill="#6d3e16" />
              <rect x="73" y="86" width="6" height="4" rx="1" fill="#6d3e16" />
            </svg>

            {/* Brand Title: Abed (outlined orange) + Furniture & Interior (black) */}
            <div className="flex flex-col text-left justify-center">
              <span 
                className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#ff8a00]"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textShadow: '0 0 1px #9c5b28, 0 1px 1px #9c5b28'
                }}
              >
                {brandNameLeft}
              </span>
              <span className="text-sm sm:text-base font-black tracking-tight text-stone-900 uppercase mt-0.5 font-sans border-b-2 border-stone-800 pb-0.5">
                {brandNameRight}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Headings matching reference photo */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-1 mb-8 sm:mb-10 text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-stone-850 tracking-tight">
            We are
          </h3>
          <h1 className="text-3xl sm:text-5xl md:text-5.5xl font-black text-stone-900 tracking-tight leading-tight">
            Under Maintenance!
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#ff7a00] pt-1 tracking-tight">
            We'll Be Back Soon!
          </h2>
        </motion.div>

        {/* ========================================================
            CENTER ILLUSTRATION (Laptop with barrier tape, cone, 
            construction crane, workers, and cogs)
            ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full max-w-[480px] sm:max-w-[540px] mx-auto px-4"
        >
          <svg 
            viewBox="0 0 600 460" 
            className="w-full h-auto drop-shadow-lg"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Soft Sky Blue Cloud / Oval Backdrop */}
            <ellipse cx="300" cy="270" rx="240" ry="150" fill="#e9f3fc" />
            <circle cx="160" cy="210" r="14" fill="#d8eafb" />
            <circle cx="440" cy="220" r="20" fill="#d8eafb" />

            {/* Background Decorative Plus Marks */}
            <path d="M120 180 V192 M114 186 H126" stroke="#90bfe8" strokeWidth="3" strokeLinecap="round" />
            <path d="M470 120 V132 M464 126 H476" stroke="#90bfe8" strokeWidth="3" strokeLinecap="round" />
            <path d="M510 240 V252 M504 246 H516" stroke="#90bfe8" strokeWidth="3" strokeLinecap="round" />

            {/* Construction Tower Crane in the background */}
            <g opacity="0.65">
              {/* Vertical Mast */}
              <line x1="390" y1="60" x2="390" y2="180" stroke="#7aaad6" strokeWidth="3" />
              <line x1="398" y1="60" x2="398" y2="180" stroke="#7aaad6" strokeWidth="3" />
              <path d="M390 75 L398 85 M398 85 L390 95 M390 95 L398 105 M398 105 L390 115 M390 115 L398 125 M398 125 L390 135 M390 135 L398 145 M398 145 L390 155 M390 155 L398 165" stroke="#7aaad6" strokeWidth="1.5" />
              
              {/* Jib / Horizontal Boom */}
              <line x1="320" y1="65" x2="460" y2="65" stroke="#7aaad6" strokeWidth="3" />
              <line x1="320" y1="72" x2="445" y2="72" stroke="#7aaad6" strokeWidth="2" />
              {/* Crane Top Apex & Cables */}
              <polygon points="394,40 388,65 400,65" fill="#7aaad6" />
              <line x1="394" y1="40" x2="340" y2="65" stroke="#7aaad6" strokeWidth="1.5" />
              <line x1="394" y1="40" x2="450" y2="65" stroke="#7aaad6" strokeWidth="1.5" />
              {/* Hook Cable */}
              <line x1="345" y1="65" x2="345" y2="105" stroke="#7aaad6" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="341" y="105" width="8" height="6" fill="#f57c00" rx="1" />
            </g>

            {/* Big Orange Gear (Top Right) */}
            <g transform="translate(480, 150) rotate(15)">
              <circle cx="0" cy="0" r="24" fill="#f57c00" />
              <circle cx="0" cy="0" r="10" fill="#ffffff" />
              {/* Teeth */}
              <rect x="-5" y="-30" width="10" height="8" rx="2" fill="#f57c00" />
              <rect x="-5" y="22" width="10" height="8" rx="2" fill="#f57c00" />
              <rect x="-30" y="-5" width="8" height="10" rx="2" fill="#f57c00" />
              <rect x="22" y="-5" width="8" height="10" rx="2" fill="#f57c00" />
              <rect x="-22" y="-22" width="9" height="9" rx="2" fill="#f57c00" transform="rotate(45)" />
              <rect x="14" y="-22" width="9" height="9" rx="2" fill="#f57c00" transform="rotate(45)" />
              <rect x="-22" y="14" width="9" height="9" rx="2" fill="#f57c00" transform="rotate(45)" />
              <rect x="14" y="14" width="9" height="9" rx="2" fill="#f57c00" transform="rotate(45)" />
            </g>

            {/* Yellow Gear (Bottom Left) */}
            <g transform="translate(180, 275) rotate(30)">
              <circle cx="0" cy="0" r="18" fill="#fbc02d" />
              <circle cx="0" cy="0" r="7" fill="#ffffff" />
              <rect x="-4" y="-24" width="8" height="7" rx="1" fill="#fbc02d" />
              <rect x="-4" y="17" width="8" height="7" rx="1" fill="#fbc02d" />
              <rect x="-24" y="-4" width="7" height="8" rx="1" fill="#fbc02d" />
              <rect x="17" y="-4" width="7" height="8" rx="1" fill="#fbc02d" />
            </g>

            {/* =======================================
                LAPTOP BODY
                ======================================= */}
            {/* Screen Lid Back Shadow */}
            <rect x="225" y="175" width="250" height="165" rx="12" fill="#2c3e50" />
            {/* Inner Screen Display (Sky blue with code/window divisions) */}
            <rect x="233" y="183" width="234" height="149" rx="8" fill="#d9ebf9" />
            
            {/* Window Header */}
            <rect x="233" y="183" width="234" height="18" rx="6" fill="#88b5dd" />
            <circle cx="243" cy="192" r="3.5" fill="#f25f5c" />
            <circle cx="253" cy="192" r="3.5" fill="#ffe066" />
            <circle cx="263" cy="192" r="3.5" fill="#70c1b3" />

            {/* Window Content Skeleton Blocks */}
            <rect x="242" y="209" width="105" height="113" rx="4" fill="#b9d7ef" />
            <rect x="250" y="217" width="89" height="10" rx="2" fill="#9ec5e8" />
            <rect x="250" y="233" width="70" height="6" rx="2" fill="#9ec5e8" />
            <rect x="250" y="244" width="80" height="6" rx="2" fill="#9ec5e8" />

            <rect x="355" y="209" width="104" height="113" rx="4" fill="#b9d7ef" />
            <rect x="363" y="217" width="88" height="10" rx="2" fill="#9ec5e8" />
            <rect x="363" y="233" width="75" height="6" rx="2" fill="#9ec5e8" />
            <rect x="363" y="244" width="60" height="6" rx="2" fill="#9ec5e8" />

            {/* Diagonal Caution / Barrier Ribbon across Screen (Yellow and Dark Navy Stripes) */}
            <g clipPath="url(#screenClip)">
              <defs>
                <clipPath id="screenClip">
                  <rect x="225" y="175" width="250" height="165" rx="10" />
                </clipPath>
                <pattern id="hazardStripes" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="14" height="28" fill="#fbc02d" />
                  <rect x="14" width="14" height="28" fill="#1c2d42" />
                </pattern>
              </defs>
              <rect x="220" y="228" width="260" height="34" fill="url(#hazardStripes)" stroke="#1a2530" strokeWidth="2" />
            </g>

            {/* Laptop Base / Keyboard (Perspective View) */}
            <polygon points="190,340 510,340 540,366 160,366" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Front Lip */}
            <polygon points="160,366 540,366 540,372 160,372" fill="#cbd5e1" />
            {/* Trackpad */}
            <rect x="325" y="356" width="50" height="8" rx="2" fill="#94a3b8" />
            {/* Keyboard Keys Area */}
            <g opacity="0.45">
              <rect x="215" y="344" width="270" height="10" fill="#334155" rx="2" />
              <rect x="222" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="242" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="262" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="282" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="302" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="322" y="345" width="56" height="8" fill="#cbd5e1" rx="1" />
              <rect x="382" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="402" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="422" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="442" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
              <rect x="462" y="345" width="16" height="8" fill="#cbd5e1" rx="1" />
            </g>

            {/* Traffic Cone in Front of Laptop */}
            <g transform="translate(240, 270)">
              {/* Base */}
              <ellipse cx="40" cy="85" rx="28" ry="8" fill="#d9531e" />
              <ellipse cx="40" cy="83" rx="26" ry="6" fill="#f57c00" />
              {/* Cone Body */}
              <polygon points="40,14 18,80 62,80" fill="#f57c00" />
              {/* White Reflective Stripes */}
              <polygon points="34,36 46,36 49,48 31,48" fill="#ffffff" />
              <polygon points="28,58 52,58 56,69 24,69" fill="#ffffff" />
              {/* Tip */}
              <circle cx="40" cy="14" r="3" fill="#f57c00" />
            </g>

            {/* Engineer 1: Sitting on top of the laptop on left side */}
            <g transform="translate(185, 140)">
              {/* Yellow Helmet */}
              <path d="M48 20 C48 13 58 13 58 20 Z" fill="#fbc02d" />
              <ellipse cx="53" cy="20" rx="9" ry="2.5" fill="#fbc02d" />
              {/* Head */}
              <circle cx="53" cy="24" r="5" fill="#fcd34d" />
              {/* Orange Shirt Body */}
              <path d="M46 29 L60 29 L64 54 L44 54 Z" fill="#f57c00" />
              {/* Arm & Small Laptop */}
              <path d="M49 33 L38 46 L46 48" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
              <rect x="28" y="44" width="14" height="3" fill="#334155" rx="1" />
              <polygon points="38,44 42,36 45,36 41,44" fill="#475569" />
              {/* Dark Pants & Sitting Legs */}
              <path d="M44 54 L58 54 L62 70 L48 70 Z" fill="#1e293b" />
              <path d="M48 68 L32 70 L30 82" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="30" cy="84" rx="4" ry="2" fill="#0f172a" />
            </g>

            {/* Engineer 2: Standing on the right holding megaphone */}
            <g transform="translate(485, 235)">
              {/* Yellow Helmet */}
              <path d="M25 15 C25 8 36 8 36 15 Z" fill="#fbc02d" />
              <ellipse cx="30" cy="15" rx="9" ry="2.5" fill="#fbc02d" />
              {/* Head */}
              <circle cx="30" cy="20" r="5" fill="#fcd34d" />
              {/* Orange Shirt / Vest */}
              <path d="M22 25 L38 25 L42 60 L18 60 Z" fill="#f57c00" />
              {/* Blue / Dark Pants */}
              <path d="M19 60 L28 60 L26 100 L18 100 Z" fill="#1e293b" />
              <path d="M30 60 L39 60 L41 100 L33 100 Z" fill="#1e293b" />
              {/* Shoes */}
              <rect x="15" y="99" width="12" height="5" rx="2" fill="#0f172a" />
              <rect x="33" y="99" width="12" height="5" rx="2" fill="#0f172a" />
              {/* Left Arm holding paper / clipboard */}
              <path d="M37 30 L45 42 L42 56" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
              <rect x="40" y="52" width="10" height="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" rx="1" />
              <line x1="42" y1="56" x2="48" y2="56" stroke="#f57c00" strokeWidth="1.5" />
              <line x1="42" y1="60" x2="48" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Right Arm holding Bullhorn / Megaphone pointing left */}
              <path d="M22 30 L12 36 L16 46" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
              {/* Megaphone */}
              <polygon points="6,34 16,39 16,43 6,48" fill="#f57c00" />
              <rect x="15" y="39" width="4" height="4" fill="#334155" />
              <path d="M5 33 C3 37 3 45 5 49 Z" fill="#ffb74d" />
            </g>
          </svg>
        </motion.div>
      </div>

      {/* ========================================================
          ORGANIC WAVE TRANSITION DIVIDER (White -> Soft Blue)
          ======================================================== */}
      <div className="w-full relative leading-none -mt-4 sm:-mt-6">
        <svg 
          className="w-full h-16 sm:h-24 md:h-28 text-[#b9d5f3] block" 
          viewBox="0 0 1440 160" 
          fill="currentColor" 
          preserveAspectRatio="none"
        >
          <path d="M0,40 C320,130 520,140 760,70 C1000,0 1240,40 1440,80 L1440,160 L0,160 Z" />
        </svg>
      </div>

      {/* ========================================================
          BOTTOM BLUE SECTION: Exactly matching reference photo
          ======================================================== */}
      <div className="bg-[#b9d5f3] pt-2 pb-10 sm:pb-14 px-4 text-center relative z-20">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Big Bengali Heading */}
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0e3b78] tracking-tight font-serif"
            style={{ textShadow: '0 1px 2px rgba(14,59,120,0.1)' }}
          >
            আমরা খুবই শীঘ্রই আবার ফিরবো
          </motion.h2>

          {/* Maintenance by Admin: Md. Alif */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-2 text-base sm:text-xl text-[#0d2247] tracking-wide font-sans"
          >
            <span>Maintenance by Admin : </span>
            <strong className="font-extrabold text-[#091733]">Md. Alif</strong>
          </motion.div>

          {/* Direct Urgent Assistance Contact Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 bg-[#0e3b78] hover:bg-[#092b5a] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-md transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>জরুরি প্রয়োজনে কল করুন</span>
            </a>

            <a
              href={`https://wa.me/${cleanPhone.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp চ্যাট</span>
            </a>

            {/* Discreet Admin Login entry */}
            {onGoToAdmin && (
              <button
                type="button"
                onClick={onGoToAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-[#0e3b78]/70 hover:text-[#0e3b78] font-bold px-3 py-2 rounded-lg hover:bg-white/40 transition-colors cursor-pointer"
                title="Admin Login Gateway"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </motion.div>

        </div>
      </div>

    </div>
  );
};

export default MaintenancePage;
