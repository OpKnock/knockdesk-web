export function MarkSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <mask id="kd-mask">
          <rect width="443" height="443" fill="#fff" />
          <circle cx="222" cy="206" r="166" fill="#000" />
          <rect y="215" width="443" height="44" fill="#fff" />
        </mask>
      </defs>
      <symbol id="kd-mark" viewBox="0 0 443 443">
        <rect width="443" height="443" rx="110" fill="currentColor" mask="url(#kd-mask)" />
      </symbol>
    </svg>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 443 443" aria-hidden="true">
      <use href="#kd-mark" />
    </svg>
  );
}
