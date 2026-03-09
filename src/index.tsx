import { PanelSection, PanelSectionRow, staticClasses } from "@decky/ui";
import { definePlugin } from "@decky/api";
import { GrHide } from "react-icons/gr";
import MainMenu from "./MainMenu/mainMenu";

function Content() {
  return (
    <PanelSection>
      <PanelSectionRow>
        <MainMenu />
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
