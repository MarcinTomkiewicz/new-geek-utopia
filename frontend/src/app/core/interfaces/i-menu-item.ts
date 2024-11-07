export interface IMenuItems {
    label: string;
    icon: string;
    children?: IMenuItems[];
    expanded?: boolean
}