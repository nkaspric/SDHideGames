import {
  Toggle
} from "@decky/ui";
import { IMenuToogleProps } from "./mainMenuProps";

const testToogle: IMenuToogleProps = {
value: false,
disabled: false
};

export default function MainMenu() {

  return (

<span>
    <label>Hide not installed games</label>
    <Toggle
        value={testToogle.value}
        onChange={(newValue) => {
        testToogle.value = newValue;
        }}
        disabled={undefined}
    />
</span>
  );
};

