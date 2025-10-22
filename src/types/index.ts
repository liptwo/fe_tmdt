export interface NavTopNavItem {
    name: string;
    to?: string;
    icon?: React.ReactNode;
}


export interface notifications {
    id: number;
    title: string;
    description: string;
    image: string;
    link?: string;
}
