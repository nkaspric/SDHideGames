import { Toggle } from "@decky/ui";
import { IMainMenuProps, IMenuToogleProps } from "./mainMenuProps";
import { useEffect, useState } from "react";

const testToogle: IMenuToogleProps = {
  value: false,
  disabled: false,
};
const HIDE_STYLE_ID = "decky-hider-uninstalled";

export default function MainMenu({ serverApi }: IMainMenuProps) {
  const [hider, setHider] = useState(testToogle.value);

  // 1. Charger la config sauvegardée au montage
  useEffect(() => {
    serverApi.callPluginMethod("get_settings", {}).then((res: any) => {
      if (res.success && res.result.hider !== undefined) {
        setHider(res.result.hider);
      }
    });
  }, []);

  // 2. Appliquer le CSS quand le toggle change
  useEffect(() => {
    let styleTag = document.getElementById(HIDE_STYLE_ID);

    if (hider) {
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = HIDE_STYLE_ID;
        // Cible les capsules non installées UNIQUEMENT dans le ruban Home
        styleTag.innerHTML = `
          [class*="libraryhome_Home"] [class*="libraryhome_NonInstalled"],
          [class*="libraryhome_Home"] [class*="gamecapsule_NotInstalled"] {
              display: none !important;
          }
        `;
        document.head.appendChild(styleTag);
      }
    } else {
      styleTag?.remove();
    }

    // Sauvegarde persistante
    serverApi.callPluginMethod("set_settings", { hider });
  }, [hider, serverApi]);

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
          disabled={testToogle.disabled}
        />
        <p style={{ margin: 0 }}>
          {hider ? <i>Games are hidden</i> : <i>Games are not hidden</i>}
        </p>
      </div>
    </span>
  );
}
