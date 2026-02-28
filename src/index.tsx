import {
  PanelSection,
  PanelSectionRow,
  staticClasses
} from "@decky/ui";
import {
  definePlugin,
} from "@decky/api"
import { FaShip } from "react-icons/fa";
import MainMenu from "./MainMenu/mainMenu";

function Content() {


  return (
    <PanelSection title="FirstSection">
      <PanelSectionRow>
        <MainMenu/>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin(() => {
  return {
    // The name shown in various decky menus
    name: "SDHideGames",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>SDHideGames</div>,
    // The content of your plugin's menu
    content: <Content />,
    // The icon displayed in the plugin list
    icon: <FaShip />,
    // The function triggered when your plugin unloads
    onDismount() {},
  };
});
