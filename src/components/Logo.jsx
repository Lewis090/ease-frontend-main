import { C } from "../styles";

export default function Logo({ inv = false, size = 1 }) {
  const ink = inv ? C.light : C.navy;
  return (
    <svg width={100 * size} height={36 * size} viewBox="0 0 100 36" fill="none">
      <circle cx="18" cy="20" r="12" stroke={ink} strokeWidth="2.4" />
      <line x1="9" y1="20" x2="27" y2="20" stroke={ink} strokeWidth="2" />
      <line x1="11.5" y1="26" x2="24.5" y2="26" stroke={ink} strokeWidth="2" />
      <path d="M16.5 8 C18.5 3,27 1,31 5 C27 4,21 7,19 11 Z" fill={C.primary} />
      <text x="35" y="27" fontFamily="Inter" fontWeight="800" fontSize="20" fill={ink}>
        Ease
      </text>
    </svg>
  );
}
