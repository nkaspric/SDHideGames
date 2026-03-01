export interface IMenuToogleProps {
  value: boolean;
  disabled?: boolean;
  onChange?(checked: boolean): void;
  navRef?: any; // TODO figure out what this is
}

export interface ServerAPI {
  callPluginMethod: (methodName: string, args: any) => Promise<any>;
}

export interface IMainMenuProps {
  serverApi: ServerAPI;
}
