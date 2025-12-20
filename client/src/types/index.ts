export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    themePreference?: string;
    mobile?: string;
    bio?: string;
    address?: string;
}

export interface Product {
    _id: string;
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
    stock?: number;
    tags?: string[];
}

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

export interface Order {
    _id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items?: Array<{
        product: Product;
        quantity: number;
    }>;
}
