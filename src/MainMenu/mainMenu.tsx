import { Toggle } from "@decky/ui";
import { useEffect, useRef, useState } from "react";
import { call } from "@decky/api";

const STYLE_ID = "sd-hide-games-style";

export default function MainMenu() {
  const [hider, setHider] = useState<boolean>(false);
  // On utilise une Ref pour que le listener ait toujours accès à la valeur actuelle du toggle
  const hiderRef = useRef(false);

  const updateHiderState = (val: boolean) => {
    setHider(val);
    hiderRef.current = val;
  };

  const applyHomeFilter = async (shouldHide: boolean) => {
    let styleElement = document.getElementById(STYLE_ID);

    if (!shouldHide) {
      styleElement?.remove();
      return;
    }

    try {
      const installedIds: string[] = await call("get_installed_appids");
      if (!installedIds || installedIds.length === 0) return;

      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = STYLE_ID;
        document.head.appendChild(styleElement);
      }

      // On crée une liste d'IDs autorisés pour le sélecteur
      const exclusion = installedIds
        .map((id) => `:not([data-appid="${id}"])`)
        .join("");

      styleElement.innerHTML = `
    /* 1. On cible le conteneur global de la tuile qui contient un appid non autorisé */
    /* On utilise des sélecteurs partiels pour ignorer les hash de SteamOS (ex: _3abc) */
    
    [class*="StandardItemConfig"]:has([data-appid]${exclusion}),
    [class*="GameCarouselItem"]:has([data-appid]${exclusion}),
    [class*="LibraryItem"]:has([data-appid]${exclusion}) {
        display: none !important;
        visibility: hidden !important;
        width: 0px !important;
        margin: 0px !important;
        flex: 0 0 0px !important;
    }

    /* 2. Correction pour le carrousel qui pourrait garder des espaces vides */
    [class*="gamecarousel_GameCarousel"] {
        gap: 0px !important; /* Optionnel : évite les trous si le filtrage laisse des résidus */
    }
  `;

      console.log(
        "SDHider: Style injecté avec",
        installedIds.length,
        "exceptions.",
      );
    } catch (error) {
      console.error("Erreur filtrage :", error);
    }
  };

  useEffect(() => {
    // Chargement initial
    call("get_settings").then((res: any) => {
      if (res?.success && res?.result) {
        const isEnabled = res.result.hider.hider;
        updateHiderState(isEnabled);
        if (isEnabled) applyHomeFilter(true);
      }
    });

    // 2. SOLUTION 3.7+ : L'intercepteur de navigation
    // Au lieu d'écouter l'installation (difficile), on rafraîchit le filtre
    // dès que l'utilisateur change de vue (Home -> Library, etc.) ou qu'un jeu se ferme.

    const handleUIChange = () => {
      if (hiderRef.current) {
        console.log(
          "Changement d'interface détecté, rafraîchissement du filtre...",
        );
        applyHomeFilter(true);
      }
    };

    // On écoute les transitions de navigation du Deck
    window.addEventListener("popstate", handleUIChange);

    // On peut aussi s'abonner au "GameAction" (Lancement/Fermeture)
    // qui est souvent le moment où l'utilisateur désinstalle un jeu
    // @ts-ignore
    const gameActionSub = SteamClient.Apps?.RegisterForGameActionStart?.(() => {
      setTimeout(handleUIChange, 2000);
    });

    return () => {
      window.removeEventListener("popstate", handleUIChange);
      if (gameActionSub?.unregister) gameActionSub.unregister();
    };
  }, []);

  // --- 2. USEEFFECT : SURVEILLANCE DU CARROUSEL (POLLING) ---
  // On l'ajoute ici pour s'assurer que si l'utilisateur installe un jeu,
  // ou si Steam rafraîchit l'accueil, le filtre s'applique à nouveau.
  useEffect(() => {
    const interval = setInterval(() => {
      const items = document.querySelectorAll(
        '[class*="gamecarousel_"] [data-appid]',
      );
      console.log(
        `SDHider: ${items.length} tuiles détectées dans le carrousel.`,
      );

      // Si le hider est activé, on vérifie si le carrousel est présent
      if (
        hiderRef.current &&
        document.querySelector('[class*="gamecarousel_"]')
      ) {
        console.log("SDHider - interval");
        applyHomeFilter(true);
      }
    }, 3000); // Toutes les 3 secondes pour être réactif sans ramer

    return () => clearInterval(interval);
  }, []);

  const onToggleChange = async (value: boolean) => {
    updateHiderState(value);
    await call("set_settings", { hider: value });
    applyHomeFilter(value);
  };

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
        <Toggle value={hider} onChange={onToggleChange} />
        <p style={{ margin: 0 }}>
          {hider ? <i>Games are hidden</i> : <i>Games are not hidden</i>}
        </p>
      </div>
    </span>
  );
}
