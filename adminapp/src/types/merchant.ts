export interface Merchant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  logo?: string;
  status: 'active' | 'inactive' | 'suspended';
  userId: string;
  created: string;
  updated: string;
}

export interface MenuCategory {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  created: string;
  updated: string;
}

export interface MenuItem {
  id: string;
  merchantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  sortOrder: number;
  created: string;
  updated: string;
}

export interface QRCode {
  id: string;
  merchantId: string;
  name: string;
  tableNumber?: string;
  zone?: string;
  url: string;
  isActive: boolean;
  created: string;
  updated: string;
}
