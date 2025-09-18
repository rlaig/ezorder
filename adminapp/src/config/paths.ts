export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  auth: {
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    dashboard: {
      path: '',
      getHref: () => '/app',
    },
    profile: {
      path: 'profile',
      getHref: () => '/app/profile',
    },
  },

  // Admin Portal Routes
  admin: {
    root: {
      path: '/admin',
      getHref: () => '/admin',
    },
    dashboard: {
      path: '',
      getHref: () => '/admin',
    },
    merchants: {
      path: 'merchants',
      getHref: () => '/admin/merchants',
    },
    merchant: {
      path: 'merchants/:merchantId',
      getHref: (id: string) => `/admin/merchants/${id}`,
    },
    analytics: {
      path: 'analytics',
      getHref: () => '/admin/analytics',
    },
    settings: {
      path: 'settings',
      getHref: () => '/admin/settings',
    },
  },

  // Merchant Dashboard Routes
  merchant: {
    root: {
      path: '/merchant',
      getHref: () => '/merchant',
    },
    dashboard: {
      path: '',
      getHref: () => '/merchant',
    },
    menu: {
      path: 'menu',
      getHref: () => '/merchant/menu',
    },
    orders: {
      path: 'orders',
      getHref: () => '/merchant/orders',
    },
    order: {
      path: 'orders/:orderId',
      getHref: (id: string) => `/merchant/orders/${id}`,
    },
    qrCodes: {
      path: 'qr-codes',
      getHref: () => '/merchant/qr-codes',
    },
    analytics: {
      path: 'analytics',
      getHref: () => '/merchant/analytics',
    },
    settings: {
      path: 'settings',
      getHref: () => '/merchant/settings',
    },
  },
} as const;
