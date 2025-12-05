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


export interface FeatBanner {
    href: string;
    title: string;
    image: string;
}

export interface TopProducts {
    id: number | string;
    title: string;
    image: string;
    sales: string;
    href: string;
}