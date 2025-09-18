import pb, { COLLECTIONS } from './pocketbase';
import { castRecord, castRecords } from '../utils/pocketbase';
import type { Database } from '../types/database';
import type { PaginatedResponse } from '../types';

export class MerchantService {
  /**
   * Get all merchants (admin only)
   */
  static async getAllMerchants(page = 1, perPage = 20): Promise<PaginatedResponse<Database.Merchants>> {
    try {
      const result = await pb.collection(COLLECTIONS.MERCHANTS).getList(page, perPage, {
        sort: '-created',
      });

      return {
        items: castRecords<Database.Merchants>(result.items),
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
  static async getMerchant(id: string): Promise<Database.Merchants> {
    try {
      const record = await pb.collection(COLLECTIONS.MERCHANTS).getOne(id);
      return castRecord<Database.Merchants>(record);
    } catch (error) {
      console.error('Get merchant error:', error);
      throw new Error('Failed to fetch merchant');
    }
  }

  /**
   * Create new merchant with user account
   */
  static async createMerchant(merchantData: {
    business_name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    gcash_number?: string;
    verifyImmediately?: boolean;
  }): Promise<Database.Merchants> {
    try {
      // Step 1: Create user account for the merchant
      const password = merchantData.password || 'TempPassword123!';
      const userData = {
        email: merchantData.email,
        password,
        passwordConfirm: password,
        name: merchantData.business_name,
        role: 'merchant',
        // Don't set verified during creation - PocketBase manages this field
      };

      const userRecord = await pb.collection(COLLECTIONS.USERS).create(userData);

      // Step 1.5: If immediate verification is requested, update the user to verified
      if (merchantData.verifyImmediately) {
        try {
          await pb.collection(COLLECTIONS.USERS).update(userRecord.id, {
            verified: true,
          });
        } catch (verifyError) {
          console.warn('Failed to verify user immediately, but user was created:', verifyError);
          // Continue with merchant creation even if verification fails
        }
      }

      // Step 2: Create merchant record linked to the user
      const merchantRecord = {
        user_id: userRecord.id,
        business_name: merchantData.business_name,
        phone: merchantData.phone,
        address: merchantData.address,
        gcash_number: merchantData.gcash_number,
        status: 'pending', // Start as pending for admin approval
        settings: {},
      };

      const record = await pb.collection(COLLECTIONS.MERCHANTS).create(merchantRecord);
      return castRecord<Database.Merchants>(record);
    } catch (error) {
      console.error('Create merchant error:', error);
      
      // Provide more specific error messages
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error as any;
        if (errorData.data?.data?.email) {
          throw new Error('Email address is already in use');
        }
        if (errorData.data?.data?.user_id) {
          throw new Error('User account creation failed');
        }
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      }
      
      throw new Error('Failed to create merchant account');
    }
  }

  /**
   * Update merchant
   */
  static async updateMerchant(id: string, data: Partial<Database.Merchants>): Promise<Database.Merchants> {
    try {
      const record = await pb.collection(COLLECTIONS.MERCHANTS).update(id, data);
      return castRecord<Database.Merchants>(record);
    } catch (error) {
      console.error('Update merchant error:', error);
      throw new Error('Failed to update merchant');
    }
  }

  /**
   * Get menu categories for a merchant
   */
  static async getMenuCategories(merchantId: string): Promise<Database.MenuCategories[]> {
    try {
      const records = await pb.collection(COLLECTIONS.MENU_CATEGORIES).getFullList({
        filter: `merchant_id = "${merchantId}"`,
        sort: 'sort_order,name',
      });
      return castRecords<Database.MenuCategories>(records);
    } catch (error) {
      console.error('Get menu categories error:', error);
      throw new Error('Failed to fetch menu categories');
    }
  }

  /**
   * Create menu category
   */
  static async createMenuCategory(data: Partial<Database.MenuCategories>): Promise<Database.MenuCategories> {
    try {
      const record = await pb.collection(COLLECTIONS.MENU_CATEGORIES).create(data);
      return castRecord<Database.MenuCategories>(record);
    } catch (error) {
      console.error('Create menu category error:', error);
      throw new Error('Failed to create menu category');
    }
  }

  /**
   * Get menu items for a merchant
   */
  static async getMenuItems(merchantId: string, categoryId?: string): Promise<Database.MenuItems[]> {
    try {
      let filter = `merchant_id = "${merchantId}"`;
      if (categoryId) {
        filter += ` && category_id = "${categoryId}"`;
      }

      const records = await pb.collection(COLLECTIONS.MENU_ITEMS).getFullList({
        filter,
        sort: 'sort_order,name',
      });
      return castRecords<Database.MenuItems>(records);
    } catch (error) {
      console.error('Get menu items error:', error);
      throw new Error('Failed to fetch menu items');
    }
  }

  /**
   * Create menu item
   */
  static async createMenuItem(data: Partial<Database.MenuItems>): Promise<Database.MenuItems> {
    try {
      const record = await pb.collection(COLLECTIONS.MENU_ITEMS).create(data);
      return castRecord<Database.MenuItems>(record);
    } catch (error) {
      console.error('Create menu item error:', error);
      throw new Error('Failed to create menu item');
    }
  }

  /**
   * Update menu item
   */
  static async updateMenuItem(id: string, data: Partial<Database.MenuItems>): Promise<Database.MenuItems> {
    try {
      const record = await pb.collection(COLLECTIONS.MENU_ITEMS).update(id, data);
      return castRecord<Database.MenuItems>(record);
    } catch (error) {
      console.error('Update menu item error:', error);
      throw new Error('Failed to update menu item');
    }
  }

  /**
   * Get QR codes for a merchant
   */
  static async getQRCodes(merchantId: string): Promise<Database.QrCodes[]> {
    try {
      const records = await pb.collection(COLLECTIONS.QR_CODES).getFullList({
        filter: `merchant_id = "${merchantId}"`,
        sort: '-created',
      });
      return castRecords<Database.QrCodes>(records);
    } catch (error) {
      console.error('Get QR codes error:', error);
      throw new Error('Failed to fetch QR codes');
    }
  }

  /**
   * Create QR code
   */
  static async createQRCode(data: Partial<Database.QrCodes>): Promise<Database.QrCodes> {
    try {
      const record = await pb.collection(COLLECTIONS.QR_CODES).create(data);
      return castRecord<Database.QrCodes>(record);
    } catch (error) {
      console.error('Create QR code error:', error);
      throw new Error('Failed to create QR code');
    }
  }
}
