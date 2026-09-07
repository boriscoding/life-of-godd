export function ChambreIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 240" fill="none" {...props}>
      <rect width="400" height="240" fill="#EDE9DC" />
      <rect x="0" y="150" width="400" height="90" fill="#E4DECB" />
      <rect x="280" y="30" width="90" height="90" rx="4" fill="#DCE7DF" stroke="#1F3D33" strokeWidth="1.5" />
      <path d="M280 30 325 68 370 30" stroke="#1F3D33" strokeWidth="1.5" fill="none" />
      <rect x="30" y="110" width="230" height="100" rx="10" fill="#1F3D33" />
      <rect x="30" y="95" width="230" height="30" rx="8" fill="#2F5445" />
      <rect x="40" y="120" width="90" height="55" rx="6" fill="#FAF8F3" />
      <rect x="135" y="120" width="90" height="55" rx="6" fill="#FAF8F3" opacity="0.85" />
      <rect x="20" y="70" width="18" height="140" rx="4" fill="#0F1E19" />
      <circle cx="330" cy="150" r="10" fill="#D97A55" />
      <rect x="322" y="150" width="16" height="60" fill="#B8863B" />
      <rect x="300" y="205" width="60" height="6" rx="3" fill="#0F1E19" opacity="0.5" />
    </svg>
  );
}

export function AppartementIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 240" fill="none" {...props}>
      <rect width="400" height="240" fill="#EDE9DC" />
      <rect x="0" y="160" width="400" height="80" fill="#E4DECB" />
      <rect x="40" y="30" width="120" height="90" rx="4" fill="#DCE7DF" stroke="#1F3D33" strokeWidth="1.5" />
      <path d="M40 30 100 68 160 30" stroke="#1F3D33" strokeWidth="1.5" fill="none" />
      <path d="M60 200c0-45 30-75 70-75s70 30 70 75" fill="#1F3D33" />
      <rect x="60" y="195" width="140" height="16" rx="8" fill="#0F1E19" />
      <rect x="220" y="120" width="70" height="80" rx="6" fill="#D97A55" opacity="0.85" />
      <rect x="220" y="112" width="70" height="14" rx="6" fill="#C2643F" />
      <circle cx="330" cy="150" r="26" fill="#2F5445" />
      <rect x="322" y="150" width="16" height="55" fill="#B8863B" />
      <path d="M330 130c10 8 10 20 0 28" stroke="#FAF8F3" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function BureauIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 400 240" fill="none" {...props}>
      <rect width="400" height="240" fill="#EDE9DC" />
      <rect x="0" y="175" width="400" height="65" fill="#E4DECB" />
      <rect x="30" y="30" width="340" height="100" rx="4" fill="#DCE7DF" stroke="#1F3D33" strokeWidth="1.5" />
      <line x1="120" y1="30" x2="120" y2="130" stroke="#1F3D33" strokeWidth="1.2" />
      <line x1="210" y1="30" x2="210" y2="130" stroke="#1F3D33" strokeWidth="1.2" />
      <line x1="300" y1="30" x2="300" y2="130" stroke="#1F3D33" strokeWidth="1.2" />
      <rect x="60" y="160" width="200" height="12" rx="4" fill="#1F3D33" />
      <rect x="70" y="130" width="20" height="30" fill="#0F1E19" opacity="0.6" />
      <rect x="230" y="130" width="20" height="30" fill="#0F1E19" opacity="0.6" />
      <rect x="120" y="140" width="70" height="45" rx="4" fill="#2F5445" />
      <rect x="130" y="148" width="50" height="28" rx="2" fill="#DCE7DF" />
      <circle cx="330" cy="185" r="14" fill="#D97A55" />
      <rect x="322" y="185" width="16" height="35" fill="#B8863B" />
    </svg>
  );
}