import pb, { COLLECTIONS } from './pocketbase';
import { castRecord, castRecords } from '../utils/pocketbase';
import type { Merchant, MenuCategory, MenuItem, QRCode, PaginatedResponse } from '../types';

export class MerchantService {
  /**
   * Get all merchants (admin only)
   */
  static async getAllMerchants(page = 1, perPage = 20): Promise<PaginatedResponse<Merchant>> {
    try {
      const result = await pb.collection(COLLECTIONS.MERCHANTS).getList(page, perPage, {
        sort: '-created',
      });

      return {
        items: castRecords<Merchant>(result.items),
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error('Get merchants error:', error);
      throw new Error('Failed to fetch merchants');
    }
  }

  /**
   * Get merchant by ID
   */
  static async getMerchant(id: string): Promise<Merchant> {
    try {
      const record = await pb.collection(COLLECTIONS.MERCHANTS).getOne(id);
      return castRecord<Merchant>(record);
    } catch (error) {
      console.error('Get merchant error:', error);
      throw new Error('Failed to fetch merchant');
    }
  }

  /**
   * Create new merchant
   */
  static async createMerchant(data: Partial<Merchant>): Promise<Merchant> {
    try {
      const record = await pb.collection(COLLECTIONS.MERCHANTS).create(data);
      return castRecord<Merchant>(record);
    } catch (error) {
      console.error('Create merchant error:', error);
      throw new Error('Failed to create merchant');
    }
  }

  /**
   * Update merchant
   */
  static async updateMerchant(id: string, data: Partial<Merchant>): Promise<Merchant> {
    try {
      const record = await pb.collection(COLLECTIONS.MERCHANTS).update(id, data);
      return castRecord<Merchant>(record);
    } catch (error) {
      console.error('Update merchant error:', error);
      throw new Error('Failed to update merchant');
    }
  }

  /**
   * Get menu categories for a merchant
   */
  static async getMenuCategories(merchantId: string): Promise<MenuCategory[]> {
    try {
      const records = await pb.collection(COLLECTIONS.MENU_CATEGORIES).getFullList({
        filter: `merchantId = "${merchantId}"`,
        sort: 'sortOrder,name',
      });
      return castRecords<MenuCategory>(records);
    } catch (error) {
      console.error('Get menu categories error:', error);
      throw new Error('Failed to fetch menu categories');
    }
  }

  /**
   * Create menu category
   */
  static async createMenuCategory(data: Partial<MenuCategory>): Promise<MenuCategory> {
    try {
      const record = await pb.collection(COLLECTIONS.MENU_CATEGORIES).create(data);
      return castRecord<MenuCategory>(record);
    } catch (error) {
      console.error('Create menu category error:', error);
      throw new Error('Failed to create menu category');
    }
  }

  /**
   * Get menu items for a merchant
   */
  static async getMenuItems(merchantId: string, categoryId?: string): Promise<MenuItem[]> {
    try {
      let filter = `merchantId = "${merchantId}"`;
      if (categoryId) {
        filter += ` && categoryId = "${categoryId}"`;
      }

      const records = await pb.collection(COLLECTIONS.MENU_ITEMS).getFullList({
        filter,
        sort: 'sortOrder,name',
      });
      return castRecords<MenuItem>(records);
    } catch (error) {
      console.error('Get menu items error:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  /**
   * Create menu item
   */
  static async createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const record = await pb.collection(COLLECTIONS.MENU_ITEMS).create(data);
      return castRecord<MenuItem>(record);
    } catch (error) {
      console.error('Create menu item error:', error);
      throw new Error('Failed to create menu item');
    }
  }

  /**
   * Update menu item
   */
  static async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const record = await pb.collection(COLLECTIONS.MENU_ITEMS).update(id, data);
      return castRecord<MenuItem>(record);
    } catch (error) {
      console.error('Update menu item error:', error);
      throw new Error('Failed to update menu item');
    }
  }

  /**
   * Get QR codes for a merchant
   */
  static async getQRCodes(merchantId: string): Promise<QRCode[]> {
    try {
      const records = await pb.collection(COLLECTIONS.QR_CODES).getFullList({
        filter: `merchantId = "${merchantId}"`,
        sort: '-created',
      });
      return castRecords<QRCode>(records);
    } catch (error) {
      console.error('Get QR codes error:', error);
      throw new Error('Failed to fetch QR codes');
    }
  }

  /**
   * Create QR code
   */
  static async createQRCode(data: Partial<QRCode>): Promise<QRCode> {
    try {
      const record = await pb.collection(COLLECTIONS.QR_CODES).create(data);
      return castRecord<QRCode>(record);
    } catch (error) {
      console.error('Create QR code error:', error);
      throw new Error('Failed to create QR code');
    }
  }
}
