

// Display the user's original artwork by framing the supplied sheet. No redraw.
const frames = {
  wave: "110 45 540 620",
  explore: "730 160 710 440",
  point: "1570 45 500 620",
} as const;

export function OfficialMascot({pose = "wave", className = ""}: {
  pose?: keyof typeof frames;
  className?: string;
}) {
  return <svg className={className} viewBox={frames[pose]} role="img" aria-label="Capivara oficial do Uai Bora, de chapéu e óculos escuros">
    <image href="/images/capivaras-transparentes.png" width="2172" height="724" />
  </svg>;
}

export function Brand(){return <a href="/" className="brand official-brand" aria-label="Uai Bora — início"><img src="/images/uai-bora-oficial.png" alt="Logo oficial Uai Bora" width="150" height="150"/></a>;}
