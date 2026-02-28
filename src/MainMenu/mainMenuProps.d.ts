export interface IMenuToogleProps {
    value: boolean;
    disabled?: boolean;
    onChange?(checked: boolean): void;
    navRef?: any; // TODO figure out what this is
}