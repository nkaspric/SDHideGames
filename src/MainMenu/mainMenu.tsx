import { Toggle } from "@decky/ui";
import { IMainMenuProps } from "./mainMenuProps";
import { useEffect, useState } from "react";
import { call } from "@decky/api";

const HIDE_STYLE_ID = "decky-hider-uninstalled";

export default function MainMenu({ isGameHide }: IMainMenuProps) {
  const [hider, setHider] = useState(isGameHide);
  const [hiderSave, setHiderSave] = useState(isGameHide);

  // 2. Appliquer le CSS et Sauvegarder
  useEffect(() => {
    console.log("Application du hider:", hider);

    let styleTag = document.getElementById(HIDE_STYLE_ID);

    if (hider) {
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = HIDE_STYLE_ID;
        styleTag.innerHTML = `
          [class*="libraryhome_Home"] [class*="libraryhome_NonInstalled"],
          [class*="libraryhome_Home"] [class*="gamecapsule_NotInstalled"] {
              display: none !important;
          }
        `;
        document.head.appendChild(styleTag);
      }
    } else styleTag?.remove();

    if (hiderSave != hider) {
      // On n'envoie au backend que si on n'est plus en phase de loading
      call("set_settings", { hider })
        .then((res) => {
          console.log("Sauvegarde backend:", res);
          setHiderSave(hider);
        })
        .catch((err) => console.error("Erreur sauvegarde:", err));
    }
  }, [hider]);

  // Si on est encore en train de charger, on peut afficher un spinner ou rien
  return (
    <span>
      <label>Hide not installed games</label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          paddingTop: "10px",
        }}
      >
        <Toggle
          value={hider}
          onChange={(newValue) => {
            setHider(newValue);
          }}
        />
        <p style={{ margin: 0 }}>
          {hider ? <i>Games are hidden</i> : <i>Games are not hidden</i>}
        </p>
      </div>
    </span>
  );
}
