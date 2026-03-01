import { PanelSection, PanelSectionRow, staticClasses } from "@decky/ui";
import { definePlugin } from "@decky/api";
import { GrHide } from "react-icons/gr";
import MainMenu from "./MainMenu/mainMenu";

interface IServerAPI {
  callPluginMethod: (methodName: string, args: any) => Promise<any>;
}

function Content({ serverApi }: { serverApi: IServerAPI }) {
  return (
    <PanelSection>
      <PanelSectionRow>
        {serverApi ? <MainMenu serverApi={serverApi} /> : <div>Loading...</div>}
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin((...args: any[]) => {
  console.log("DEBUG ARGS:", args);
  const serverApi = args[0] as IServerAPI;
  console.log("SDHideGames loaded, serverApi:", serverApi);
  return {
    // The name shown in various decky menus
    name: "SDHideGames",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>SDHideGames</div>,
    // The content of your plugin's menu
    content: <Content serverApi={serverApi} />,
    icon: <GrHide />,
    onDismount() {
      // Cleaning
      const style = document.getElementById("decky-hider-uninstalled");
      style?.remove();
    },
  };
});
