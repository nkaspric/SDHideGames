import { PanelSection, PanelSectionRow, staticClasses } from "@decky/ui";
import { call, definePlugin } from "@decky/api";
import { GrHide } from "react-icons/gr";
import MainMenu from "./MainMenu/mainMenu";
import { useEffect, useState } from "react";

function Content() {
  const [loading, setLoading] = useState(true);
  const [hider, setHider] = useState(false);

  // 1. Charger la config au montage
  useEffect(() => {
    call("get_settings", {})
      .then((res: any) => {
        // On suppose que ton backend renvoie { success: true, result: { hider: true/false } }
        if (res?.success && res?.result?.hider !== undefined) {
          console.log("Config chargée depuis le backend:", res.result.hider);
          setHider(res.result.hider);
        }
        setLoading(false); // On libère la sauvegarde une fois chargé
      })
      .catch((err) => {
        console.error("Erreur chargement settings:", err);
        setLoading(false);
      });
  }, []);

  return (
    <PanelSection>
      <PanelSectionRow>
        {loading ? (
          <p>
            <i>SDHideGames plugin is loading...</i>
          </p>
        ) : (
          <MainMenu isGameHide={hider} />
        )}
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => {
  return {
    // The name shown in various decky menus
    name: "SDHideGames",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>SDHideGames</div>,
    // The content of your plugin's menu
    content: <Content />,
    icon: <GrHide />,
    onDismount() {
      // Cleaning
      const style = document.getElementById("decky-hider-uninstalled");
      style?.remove();
    },
  };
});
