import { useEffect } from "react";

export default function SpireCodexChangelog({ className }: { className?: string }) {
  useEffect(() => {
    // Prevent loading the script multiple times
    if (document.getElementById("spire-codex-script")) return;

    const script = document.createElement("script");
    script.src =
      "https://spire-codex.com/widget/spire-codex-changelog.js";
    script.async = true;
    script.id = "spire-codex-script";

    document.body.appendChild(script);

    return () => {
      // Optional cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="scx-changelog"
      className={`w-full h-full ${className ?? ""}`}
    />
  );
}