/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AyamEyangLogoProps {
  className?: string;
  size?: number; // width and height in pixels
}

export default function AyamEyangLogo({ className = '', size = 48 }: AyamEyangLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 hover:rotate-3`}
    >
      <defs>
        {/* Golden Gradient for the Inner Ring */}
        <linearGradient id="logoGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        
        {/* Red Gradient for Crest and Beak */}
        <linearGradient id="logoRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>

        {/* Text path for curved text "AYAM EYANG" */}
        <path id="logoTextPath" d="M 32,126 A 68,68 0 0,0 168,126" fill="none" />
        
        {/* Path for smaller curved "LADA MENGGODA" */}
        <path id="logoLadaPath" d="M 45,150 A 55,55 0 0,0 155,150" fill="none" />
      </defs>

      {/* Main Outer Red Circle */}
      <circle cx="100" cy="100" r="94" fill="#BF0A0A" />

      {/* Inner Golden Ring */}
      <circle cx="100" cy="100" r="88" stroke="url(#logoGoldGradient)" strokeWidth="3" fill="#FFFFFF" />

      {/* Inner Red Ring Accent */}
      <circle cx="100" cy="100" r="84" stroke="#BF0A0A" strokeWidth="1" fill="none" />

      {/* Stylized Red Rooster Crest (Comb) at the top */}
      <path
        d="M 100 58 
           C 92 56, 76 52, 78 36 
           C 80 20, 96 22, 100 40 
           C 104 28, 110 16, 118 18 
           C 126 20, 120 34, 114 44 
           C 122 38, 130 38, 132 46 
           C 134 54, 122 60, 108 58 
           Z"
        fill="url(#logoRedGradient)"
      />

      {/* Eyes */}
      <circle cx="82" cy="74" r="6" fill="#111827" />
      <circle cx="118" cy="74" r="6" fill="#111827" />
      
      {/* Small cute eye shines */}
      <circle cx="80" cy="72" r="1.8" fill="#FFFFFF" />
      <circle cx="116" cy="72" r="1.8" fill="#FFFFFF" />

      {/* Beak (Cute orange-red Diamond/Rhombus pointing down) */}
      <polygon
        points="100,78 110,92 100,104 90,92"
        fill="#FF5722"
      />

      {/* Curved Text "AYAM EYANG" */}
      <text>
        <textPath
          href="#logoTextPath"
          startOffset="50%"
          textAnchor="middle"
          fill="#111827"
          fontSize="17"
          fontWeight="900"
          fontFamily="'Inter', 'Space Grotesk', sans-serif"
          letterSpacing="1.2"
        >
          AYAM EYANG
        </textPath>
      </text>

      {/* Subtext "LADA MENGGODA" */}
      <text>
        <textPath
          href="#logoLadaPath"
          startOffset="50%"
          textAnchor="middle"
          fill="#BF0A0A"
          fontSize="8.5"
          fontWeight="700"
          fontFamily="'Inter', 'Space Grotesk', sans-serif"
          letterSpacing="2"
        >
          LADA MENGGODA
        </textPath>
      </text>

      {/* Chicken Feet (Two stylized black claws at the bottom) */}
      {/* Left foot */}
      <path
        d="M 82 155 L 80 168 
           M 80 168 L 70 174 
           M 80 168 L 80 177 
           M 80 168 L 90 174"
        stroke="#111827"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right foot */}
      <path
        d="M 118 155 L 120 168 
           M 120 168 L 110 174 
           M 120 168 L 120 177 
           M 120 168 L 130 174"
        stroke="#111827"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
