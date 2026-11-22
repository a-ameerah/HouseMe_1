import React from 'react';

interface SVGSceneProps {
  type: 'exterior' | 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'road' | 'meter' | 'water';
  seed?: string;
  className?: string;
}

/**
 * Beautiful, vector-drawn illustrative property scenes rendered inline.
 * Uses the HouseMe green theme with warm accents, natural shading,
 * and procedural variation based on the seed.
 */
export const SVGScene: React.FC<SVGSceneProps> = ({ type, seed = 'default', className = '' }) => {
  // Simple deterministic hash for variations
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const wallColors = ['#F0FAF4', '#EBF5EE', '#F7FBF8', '#EDF7F1'];
  const wallColor = wallColors[hash % wallColors.length];
  const accentHues = ['#0B6B4B', '#0F8A5F', '#14A66F', '#073B2A'];
  const accentColor = accentHues[hash % accentHues.length];
  const roofColors = ['#073B2A', '#134E3A', '#1B382B'];
  const roofColor = roofColors[hash % roofColors.length];

  switch (type) {
    case 'exterior':
      return (
        <svg
          viewBox="0 0 600 450"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sky Gradient */}
          <defs>
            <linearGradient id={`sky-${seed}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C9EBD9" />
              <stop offset="60%" stopColor="#E2F5EC" />
              <stop offset="100%" stopColor="#F0FAF4" />
            </linearGradient>
            <linearGradient id={`sun-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5A524" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F0FAF4" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width="600" height="450" fill={`url(#sky-${seed})`} />
          <circle cx="500" cy="90" r="60" fill={`url(#sun-${seed})`} />

          {/* Distant palm trees & greenery */}
          <path d="M40 320 Q60 220 80 320 Z" fill="#95CDB2" opacity="0.4" />
          <path d="M520 320 Q545 200 570 320 Z" fill="#95CDB2" opacity="0.4" />

          {/* Building Main Block */}
          <rect x="110" y="140" width="380" height="200" rx="8" fill={wallColor} stroke="#073B2A" strokeWidth="2.5" />
          
          {/* Modern Cantilever Roof */}
          <polygon points="90,140 510,140 480,105 120,105" fill={roofColor} />
          
          {/* Upper Balcony Glass Railing */}
          <rect x="140" y="160" width="140" height="65" rx="4" fill="#DDF3E8" stroke="#0B6B4B" strokeWidth="1.5" />
          <line x1="140" y1="190" x2="280" y2="190" stroke="#0B6B4B" strokeWidth="1.5" strokeDasharray="6,4" />
          <rect x="160" y="170" width="40" height="40" fill="#073B2A" opacity="0.85" rx="3" />
          <rect x="220" y="170" width="40" height="40" fill="#073B2A" opacity="0.85" rx="3" />

          {/* Right Upper Window */}
          <rect x="330" y="160" width="120" height="60" rx="4" fill="#DDF3E8" stroke="#0B6B4B" strokeWidth="2" />
          <line x1="390" y1="160" x2="390" y2="220" stroke="#0B6B4B" strokeWidth="2" />

          {/* Ground Floor Entrance & Porch */}
          <rect x="140" y="240" width="80" height="100" fill={accentColor} rx="3" />
          <circle cx="205" cy="290" r="3" fill="#F5A524" />
          <rect x="250" y="250" width="100" height="60" rx="4" fill="#DDF3E8" stroke="#0B6B4B" strokeWidth="2" />
          <line x1="300" y1="250" x2="300" y2="310" stroke="#0B6B4B" strokeWidth="2" />

          {/* Clean Paved Forecourt */}
          <rect x="0" y="340" width="600" height="110" fill="#E1EBE5" />
          {/* Interlocking paving pattern lines */}
          <line x1="0" y1="375" x2="600" y2="375" stroke="#CAD8D0" strokeWidth="1.5" strokeDasharray="16,8" />
          <line x1="0" y1="410" x2="600" y2="410" stroke="#CAD8D0" strokeWidth="1.5" strokeDasharray="20,10" />

          {/* Front Perimeter Compound Wall with Security Gate */}
          <rect x="0" y="325" width="180" height="60" fill="#C5D9CE" stroke="#073B2A" strokeWidth="2" />
          <rect x="420" y="325" width="180" height="60" fill="#C5D9CE" stroke="#073B2A" strokeWidth="2" />
          {/* Black & Gold Security Gate */}
          <rect x="180" y="305" width="240" height="80" fill="#073B2A" rx="4" stroke="#05281C" strokeWidth="2" />
          <line x1="180" y1="345" x2="420" y2="345" stroke="#F5A524" strokeWidth="2" />
          <line x1="300" y1="305" x2="300" y2="385" stroke="#F5A524" strokeWidth="2" />

          {/* Landscaping Flower Pots & Palm Fronds */}
          <circle cx="160" cy="385" r="16" fill="#14A66F" />
          <circle cx="440" cy="385" r="16" fill="#14A66F" />
          <circle cx="150" cy="375" r="12" fill="#0F8A5F" />
          <circle cx="450" cy="375" r="12" fill="#0F8A5F" />

          {/* Nigerian Electricity Service Cable to Building */}
          <path d="M0 60 Q 200 110 320 140" fill="none" stroke="#4A5F55" strokeWidth="1.5" strokeDasharray="4,2" />
        </svg>
      );

    case 'living':
      return (
        <svg
          viewBox="0 0 600 450"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Room Walls & Perspective */}
          <rect width="600" height="450" fill="#FAFDFB" />
          {/* Floor Tiles */}
          <polygon points="0,450 600,450 480,260 120,260" fill="#E8F1EC" stroke="#D1E2D8" strokeWidth="1" />
          {/* Tile Grid Lines */}
          <line x1="120" y1="260" x2="0" y2="450" stroke="#CADBD1" strokeWidth="1.5" />
          <line x1="480" y1="260" x2="600" y2="450" stroke="#CADBD1" strokeWidth="1.5" />
          <line x1="240" y1="260" x2="180" y2="450" stroke="#CADBD1" strokeWidth="1.5" />
          <line x1="360" y1="260" x2="420" y2="450" stroke="#CADBD1" strokeWidth="1.5" />
          <line x1="45" y1="380" x2="555" y2="380" stroke="#CADBD1" strokeWidth="1.5" />
          <line x1="85" y1="320" x2="515" y2="320" stroke="#CADBD1" strokeWidth="1.5" />

          {/* Back Wall with POP Ceiling Border */}
          <rect x="120" y="40" width="360" height="220" fill={wallColor} stroke="#073B2A" strokeWidth="1.5" />
          <rect x="100" y="20" width="400" height="24" fill="#FFFFFF" stroke="#073B2A" strokeWidth="1.5" />
          <line x1="100" y1="32" x2="500" y2="32" stroke="#DDF3E8" strokeWidth="3" />

          {/* Large Window with Sheer Curtains */}
          <rect x="160" y="70" width="120" height="130" fill="#DDF3E8" stroke="#0B6B4B" strokeWidth="2" rx="3" />
          <line x1="220" y1="70" x2="220" y2="200" stroke="#0B6B4B" strokeWidth="1.5" />
          <line x1="160" y1="135" x2="280" y2="135" stroke="#0B6B4B" strokeWidth="1.5" />
          {/* Soft light ray */}
          <polygon points="160,70 280,70 360,340 100,340" fill="#FFFFFF" opacity="0.35" />

          {/* Wall-Mounted TV / Art */}
          <rect x="330" y="85" width="110" height="68" rx="4" fill="#073B2A" stroke="#05281C" strokeWidth="2" />
          <rect x="335" y="90" width="100" height="58" rx="2" fill="#0B1F17" />
          {/* Subtle TV reflections */}
          <line x1="345" y1="95" x2="415" y2="140" stroke="#14A66F" strokeWidth="1.5" opacity="0.5" />

          {/* Media Console Shelf */}
          <rect x="310" y="180" width="150" height="25" rx="3" fill="#4A5F55" />

          {/* Contemporary 3-Seater Sofa */}
          <rect x="150" y="270" width="300" height="85" rx="16" fill={accentColor} stroke="#073B2A" strokeWidth="2" />
          {/* Sofa Cushions */}
          <rect x="165" y="260" width="85" height="45" rx="8" fill="#14A66F" />
          <rect x="255" y="260" width="85" height="45" rx="8" fill="#14A66F" />
          <rect x="345" y="260" width="85" height="45" rx="8" fill="#14A66F" />
          {/* Accent Pillows */}
          <circle cx="185" cy="275" r="14" fill="#F5A524" />
          <circle cx="410" cy="275" r="14" fill="#DDF3E8" />

          {/* Coffee Table */}
          <ellipse cx="300" cy="385" rx="75" ry="25" fill="#FFFFFF" stroke="#073B2A" strokeWidth="2" />
          <ellipse cx="300" cy="385" rx="65" ry="18" fill="#DDF3E8" />

          {/* Indoor Plant in Ceramic Pot */}
          <rect x="470" y="225" width="28" height="40" rx="3" fill="#8A9C93" stroke="#073B2A" strokeWidth="1.5" />
          <ellipse cx="484" cy="210" rx="26" ry="32" fill="#0F8A5F" />
          <ellipse cx="484" cy="205" rx="18" ry="22" fill="#14A66F" />
        </svg>
      );

    case 'kitchen':
      return (
        <svg
          viewBox="0 0 600 450"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Room background */}
          <rect width="600" height="450" fill="#F4FAF6" />
          {/* Tiled Wall Backsplash */}
          <rect x="40" y="160" width="520" height="120" fill="#E1EBE5" stroke="#073B2A" strokeWidth="1.5" />
          {/* Subway tile lines */}
          <line x1="40" y1="200" x2="560" y2="200" stroke="#CAD8D0" strokeWidth="1.5" />
          <line x1="40" y1="240" x2="560" y2="240" stroke="#CAD8D0" strokeWidth="1.5" />

          {/* Upper Cabinets */}
          <rect x="60" y="40" width="480" height="110" rx="6" fill={accentColor} stroke="#073B2A" strokeWidth="2" />
          <line x1="180" y1="40" x2="180" y2="150" stroke="#073B2A" strokeWidth="2" />
          <line x1="300" y1="40" x2="300" y2="150" stroke="#073B2A" strokeWidth="2" />
          <line x1="420" y1="40" x2="420" y2="150" stroke="#073B2A" strokeWidth="2" />
          {/* Cabinet Handles */}
          <line x1="170" y1="90" x2="170" y2="115" stroke="#F5A524" strokeWidth="3" strokeLinecap="round" />
          <line x1="290" y1="90" x2="290" y2="115" stroke="#F5A524" strokeWidth="3" strokeLinecap="round" />
          <line x1="410" y1="90" x2="410" y2="115" stroke="#F5A524" strokeWidth="3" strokeLinecap="round" />
          <line x1="530" y1="90" x2="530" y2="115" stroke="#F5A524" strokeWidth="3" strokeLinecap="round" />

          {/* Kitchen Window in the middle */}
          <rect x="220" y="170" width="160" height="90" rx="3" fill="#DDF3E8" stroke="#0B6B4B" strokeWidth="2" />
          <line x1="300" y1="170" x2="300" y2="260" stroke="#0B6B4B" strokeWidth="2" />

          {/* Bottom Countertop (Granite Style) */}
          <rect x="30" y="270" width="540" height="25" rx="3" fill="#0B1F17" />
          <rect x="40" y="295" width="520" height="140" fill={roofColor} stroke="#073B2A" strokeWidth="2" />
          <line x1="210" y1="295" x2="210" y2="435" stroke="#073B2A" strokeWidth="2" />
          <line x1="390" y1="295" x2="390" y2="435" stroke="#073B2A" strokeWidth="2" />

          {/* Stainless Steel Sink & Modern High-Arc Faucet */}
          <rect x="100" y="272" width="90" height="15" rx="2" fill="#C5D9CE" stroke="#8A9C93" strokeWidth="1" />
          <path d="M145 272 V245 Q145 235 155 235 Q165 235 165 245 V250" fill="none" stroke="#8A9C93" strokeWidth="4" strokeLinecap="round" />

          {/* Gas Hob / Cooktop */}
          <rect x="420" y="268" width="100" height="10" fill="#073B2A" rx="2" />
          <circle cx="445" cy="273" r="6" fill="#F5A524" />
          <circle cx="495" cy="273" r="6" fill="#F5A524" />

          {/* Floor */}
          <rect x="0" y="435" width="600" height="15" fill="#CAD8D0" />
        </svg>
      );

    case 'bedroom':
      return (
        <svg
          viewBox="0 0 600 450"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Warm relaxing bedroom */}
          <rect width="600" height="450" fill="#F2F8F4" />
          {/* Wooden Flooring */}
          <polygon points="0,450 600,450 510,290 90,290" fill="#E6EDE9" />
          <line x1="90" y1="290" x2="0" y2="450" stroke="#CAD8D0" strokeWidth="1" />
          <line x1="510" y1="290" x2="600" y2="450" stroke="#CAD8D0" strokeWidth="1" />

          {/* Back Accent Wall */}
          <rect x="90" y="40" width="420" height="250" fill={wallColor} stroke="#073B2A" strokeWidth="1.5" />

          {/* Modern Headboard */}
          <rect x="160" y="160" width="280" height="100" rx="8" fill={accentColor} stroke="#073B2A" strokeWidth="2" />

          {/* Large King Bed with Pillows */}
          <polygon points="175,230 425,230 460,370 140,370" fill="#FFFFFF" stroke="#073B2A" strokeWidth="2" />
          {/* Cozy Green Duvet Fold */}
          <polygon points="140,290 460,290 460,370 140,370" fill="#DDF3E8" stroke="#0B6B4B" strokeWidth="1.5" />
          {/* Plush Pillows */}
          <rect x="190" y="180" width="85" height="40" rx="6" fill="#FFFFFF" stroke="#0B6B4B" strokeWidth="1.5" />
          <rect x="325" y="180" width="85" height="40" rx="6" fill="#FFFFFF" stroke="#0B6B4B" strokeWidth="1.5" />

          {/* Side Nightstand with Lamp */}
          <rect x="80" y="240" width="60" height="60" rx="4" fill="#4A5F55" stroke="#073B2A" strokeWidth="1.5" />
          <ellipse cx="110" cy="225" rx="14" ry="10" fill="#F5A524" />
          <line x1="110" y1="225" x2="110" y2="240" stroke="#073B2A" strokeWidth="2" />

          {/* Double Window on Right with Sunlight */}
          <rect x="450" y="70" width="50" height="120" rx="3" fill="#DDF3E8" stroke="#0B6B4B" strokeWidth="1.5" />
          <line x1="450" y1="130" x2="500" y2="130" stroke="#0B6B4B" strokeWidth="1.5" />

          {/* Framed Wall Art */}
          <rect x="250" y="70" width="100" height="65" rx="3" fill="#FFFFFF" stroke="#073B2A" strokeWidth="2" />
          <circle cx="300" cy="100" r="18" fill="#14A66F" opacity="0.6" />
        </svg>
      );

    case 'bathroom':
      return (
        <svg
          viewBox="0 0 600 450"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pristine Modern Tiled Bathroom */}
          <rect width="600" height="450" fill="#F0FAF4" />
          {/* Tile Grid */}
          <g stroke="#D1E2D8" strokeWidth="1">
            <line x1="100" y1="0" x2="100" y2="450" />
            <line x1="200" y1="0" x2="200" y2="450" />
            <line x1="300" y1="0" x2="300" y2="450" />
            <line x1="400" y1="0" x2="400" y2="450" />
            <line x1="500" y1="0" x2="500" y2="450" />
            <line x1="0" y1="100" x2="600" y2="100" />
            <line x1="0" y1="200" x2="600" y2="200" />
            <line x1="0" y1="300" x2="600" y2="300" />
            <line x1="0" y1="400" x2="600" y2="400" />
          </g>

          {/* Glass Shower Cubicle on Left */}
          <rect x="50" y="40" width="180" height="370" rx="4" fill="#DDF3E8" fillOpacity="0.4" stroke="#0B6B4B" strokeWidth="2.5" />
          {/* Rainfall Showerhead */}
          <path d="M70 70 H130 V90" fill="none" stroke="#4A5F55" strokeWidth="4" strokeLinecap="round" />
          <circle cx="130" cy="94" r="14" fill="#8A9C93" />
          <line x1="120" y1="110" x2="120" y2="140" stroke="#14A66F" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="130" y1="110" x2="130" y2="145" stroke="#14A66F" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="140" y1="110" x2="140" y2="140" stroke="#14A66F" strokeWidth="1" strokeDasharray="3,3" />

          {/* Floating Vanity Sink & LED Round Mirror */}
          <circle cx="370" cy="120" r="45" fill="#FFFFFF" stroke="#0B6B4B" strokeWidth="3" />
          <circle cx="370" cy="120" r="40" fill="#DDF3E8" />
          <rect x="300" y="200" width="140" height="40" rx="6" fill="#073B2A" stroke="#05281C" strokeWidth="2" />
          <ellipse cx="370" cy="200" rx="35" ry="12" fill="#FFFFFF" stroke="#CAD8D0" strokeWidth="1.5" />
          <path d="M370 190 V175 Q370 165 380 165" fill="none" stroke="#8A9C93" strokeWidth="3" strokeLinecap="round" />

          {/* Ceramic Water Closet (Toilet) */}
          <rect x="490" y="240" width="55" height="90" rx="5" fill="#FFFFFF" stroke="#073B2A" strokeWidth="2" />
          <ellipse cx="517" cy="330" rx="25" ry="20" fill="#FFFFFF" stroke="#073B2A" strokeWidth="2" />
          <rect x="500" y="340" width="35" height="60" fill="#FFFFFF" stroke="#073B2A" strokeWidth="2" />
        </svg>
      );

    case 'road':
      return (
        <svg
          viewBox="0 0 600 450"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outdoor Street, Tarred Road & Covered Drainage Verification */}
          <rect width="600" height="450" fill="#E8F5EE" />

          {/* Blue Sky */}
          <rect width="600" height="180" fill="#CEEBDC" />

          {/* Distant street buildings and green trees */}
          <rect x="40" y="90" width="90" height="90" fill="#95CDB2" opacity="0.6" />
          <rect x="150" y="70" width="120" height="110" fill="#78B99A" opacity="0.6" />
          <circle cx="330" cy="140" r="30" fill="#0F8A5F" opacity="0.7" />
          <rect x="420" y="80" width="140" height="100" fill="#95CDB2" opacity="0.6" />

          {/* Paved Walkway Sidewalk */}
          <rect x="0" y="180" width="600" height="40" fill="#CAD8D0" stroke="#8A9C93" strokeWidth="1" />

          {/* Concrete Covered Drainage Gutter (Key Nigerian Street Feature!) */}
          <rect x="0" y="215" width="600" height="30" fill="#9FB5A9" stroke="#073B2A" strokeWidth="1.5" />
          {/* Concrete Drainage Slabs with inspection slots */}
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i}>
              <line x1={i * 60} y1="215" x2={i * 60} y2="245" stroke="#073B2A" strokeWidth="1.5" />
              <rect x={i * 60 + 20} y="227" width="20" height="6" rx="2" fill="#073B2A" />
            </g>
          ))}

          {/* Smooth Asphalt Tarred Road Surface */}
          <polygon points="0,450 600,450 600,245 0,245" fill="#364940" />
          {/* Road Curb */}
          <line x1="0" y1="245" x2="600" y2="245" stroke="#F5A524" strokeWidth="3" />

          {/* Road Center Line (Clean white dashes) */}
          <line x1="300" y1="245" x2="300" y2="450" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="25,20" />

          {/* Solar Streetlight Pole */}
          <line x1="530" y1="320" x2="530" y2="60" stroke="#4A5F55" strokeWidth="4" strokeLinecap="round" />
          <rect x="500" y="50" width="60" height="12" rx="2" fill="#073B2A" />
          <polygon points="510,50 550,50 545,40 515,40" fill="#2563EB" />
          <circle cx="530" cy="70" r="6" fill="#F5A524" />
        </svg>
      );

    case 'meter':
      return (
        <svg
          viewBox="0 0 600 450"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Concrete Wall Mounting */}
          <rect width="600" height="450" fill="#E1EBE5" />
          {/* Wall texture */}
          <line x1="0" y1="150" x2="600" y2="150" stroke="#CAD8D0" strokeWidth="1" />
          <line x1="0" y1="300" x2="600" y2="300" stroke="#CAD8D0" strokeWidth="1" />

          {/* Separate Prepaid Electric Meter Box */}
          <rect x="160" y="60" width="280" height="330" rx="14" fill="#073B2A" stroke="#05281C" strokeWidth="3" />

          {/* Meter Brand & DISCO Logo area */}
          <rect x="190" y="85" width="220" height="40" rx="6" fill="#0B1F17" />
          <text x="300" y="110" fill="#14A66F" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PREPAID ENERGY METER
          </text>

          {/* Digital LCD Display with Pulse Green Light */}
          <rect x="190" y="140" width="220" height="75" rx="6" fill="#0F3827" stroke="#14A66F" strokeWidth="2" />
          <text x="300" y="185" fill="#4ADE80" fontSize="28" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            284.65 kWh
          </text>
          <circle cx="380" cy="155" r="4" fill="#DC2626" />

          {/* Keypad Buttons (0-9 for Token recharge) */}
          <g fill="#134E3A" stroke="#073B2A" strokeWidth="1">
            <rect x="205" y="235" width="45" height="28" rx="4" />
            <rect x="277" y="235" width="45" height="28" rx="4" />
            <rect x="350" y="235" width="45" height="28" rx="4" />
            <rect x="205" y="275" width="45" height="28" rx="4" />
            <rect x="277" y="275" width="45" height="28" rx="4" />
            <rect x="350" y="275" width="45" height="28" rx="4" />
            <rect x="205" y="315" width="45" height="28" rx="4" />
            <rect x="277" y="315" width="45" height="28" rx="4" />
            <rect x="350" y="315" width="45" height="28" rx="4" />
          </g>

          {/* Heavy Gauge Conduit Pipes */}
          <rect x="285" y="390" width="30" height="60" fill="#4A5F55" />
          <line x1="300" y1="390" x2="300" y2="450" stroke="#073B2A" strokeWidth="2" />
        </svg>
      );

    case 'water':
      return (
        <svg
          viewBox="0 0 600 450"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outdoor Compound with Elevated Borehole Overhead Tanks */}
          <rect width="600" height="450" fill="#E8F5EE" />

          {/* Sky */}
          <rect width="600" height="250" fill="#D3ECE0" />

          {/* Steel Scaffolding Water Tower Stand */}
          <line x1="200" y1="150" x2="160" y2="390" stroke="#073B2A" strokeWidth="6" strokeLinecap="round" />
          <line x1="400" y1="150" x2="440" y2="390" stroke="#073B2A" strokeWidth="6" strokeLinecap="round" />
          {/* Cross bracing */}
          <line x1="180" y1="230" x2="420" y2="310" stroke="#0B6B4B" strokeWidth="3" />
          <line x1="420" y1="230" x2="180" y2="310" stroke="#0B6B4B" strokeWidth="3" />
          <line x1="170" y1="270" x2="430" y2="270" stroke="#073B2A" strokeWidth="4" />

          {/* Black GeePee / Overhead Water Tanks (2,000L & 1,500L) */}
          <rect x="180" y="60" width="110" height="95" rx="10" fill="#0B1F17" stroke="#073B2A" strokeWidth="2" />
          <rect x="310" y="60" width="110" height="95" rx="10" fill="#0B1F17" stroke="#073B2A" strokeWidth="2" />
          {/* Tank Rib Rings */}
          <line x1="180" y1="90" x2="290" y2="90" stroke="#134E3A" strokeWidth="2" />
          <line x1="180" y1="120" x2="290" y2="120" stroke="#134E3A" strokeWidth="2" />
          <line x1="310" y1="90" x2="420" y2="90" stroke="#134E3A" strokeWidth="2" />
          <line x1="310" y1="120" x2="420" y2="120" stroke="#134E3A" strokeWidth="2" />

          {/* Ground Water Filtration Treatment Cylinders */}
          <rect x="120" y="320" width="35" height="70" rx="6" fill="#2563EB" stroke="#073B2A" strokeWidth="2" />
          <rect x="165" y="320" width="35" height="70" rx="6" fill="#2563EB" stroke="#073B2A" strokeWidth="2" />

          {/* Concrete Base */}
          <rect x="100" y="390" width="400" height="40" fill="#CAD8D0" stroke="#073B2A" strokeWidth="2" rx="4" />
          <line x1="0" y1="430" x2="600" y2="430" stroke="#073B2A" strokeWidth="2" />
        </svg>
      );

    default:
      return <div className="w-full h-full bg-brand-100" />;
  }
};
