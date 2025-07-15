// Sistema centralizado de permissões
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  // Permissões de usuários
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  
  // Permissões de produtos
  CREATE_PRODUCTS: 'create_products',
  EDIT_PRODUCTS: 'edit_products',
  DELETE_PRODUCTS: 'delete_products',
  VIEW_PRODUCTS: 'view_products',
  
  // Permissões de categorias
  CREATE_CATEGORIES: 'create_categories',
  EDIT_CATEGORIES: 'edit_categories',
  DELETE_CATEGORIES: 'delete_categories',
  VIEW_CATEGORIES: 'view_categories',
  
  // Permissões de fornecedores
  CREATE_SUPPLIERS: 'create_suppliers',
  EDIT_SUPPLIERS: 'edit_suppliers',
  DELETE_SUPPLIERS: 'delete_suppliers',
  VIEW_SUPPLIERS: 'view_suppliers',
  
  // Permissões de estoque
  ADJUST_STOCK: 'adjust_stock',
  TRANSFER_STOCK: 'transfer_stock',
  VIEW_STOCK: 'view_stock',
  
  // Permissões de movimentações
  CREATE_MOVEMENTS: 'create_movements',
  EDIT_MOVEMENTS: 'edit_movements',
  DELETE_MOVEMENTS: 'delete_movements',
  VIEW_MOVEMENTS: 'view_movements',
  
  // Permissões de contagem
  CREATE_COUNTING: 'create_counting',
  EDIT_COUNTING: 'edit_counting',
  DELETE_COUNTING: 'delete_counting',
  VIEW_COUNTING: 'view_counting',
  
  // Permissões de relatórios
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',
  
  // Permissões de auditoria
  VIEW_AUDIT: 'view_audit',
  
  // Permissões de configurações
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_SETTINGS: 'view_settings'
};

// Mapeamento de roles para permissões
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Admins têm todas as permissões
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.EDIT_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_CATEGORIES,
    PERMISSIONS.EDIT_CATEGORIES,
    PERMISSIONS.DELETE_CATEGORIES,
    PERMISSIONS.VIEW_CATEGORIES,
    PERMISSIONS.CREATE_SUPPLIERS,
    PERMISSIONS.EDIT_SUPPLIERS,
    PERMISSIONS.DELETE_SUPPLIERS,
    PERMISSIONS.VIEW_SUPPLIERS,
    PERMISSIONS.ADJUST_STOCK,
    PERMISSIONS.TRANSFER_STOCK,
    PERMISSIONS.VIEW_STOCK,
    PERMISSIONS.CREATE_MOVEMENTS,
    PERMISSIONS.EDIT_MOVEMENTS,
    PERMISSIONS.DELETE_MOVEMENTS,
    PERMISSIONS.VIEW_MOVEMENTS,
    PERMISSIONS.CREATE_COUNTING,
    PERMISSIONS.EDIT_COUNTING,
    PERMISSIONS.DELETE_COUNTING,
    PERMISSIONS.VIEW_COUNTING,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_AUDIT,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_SETTINGS
  ],
  [ROLES.EDITOR]: [
    // Editores podem criar/editar a maioria das coisas, mas não gerenciar usuários
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.EDIT_PRODUCTS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_CATEGORIES,
    PERMISSIONS.EDIT_CATEGORIES,
    PERMISSIONS.VIEW_CATEGORIES,
    PERMISSIONS.CREATE_SUPPLIERS,
    PERMISSIONS.EDIT_SUPPLIERS,
    PERMISSIONS.VIEW_SUPPLIERS,
    PERMISSIONS.ADJUST_STOCK,
    PERMISSIONS.TRANSFER_STOCK,
    PERMISSIONS.VIEW_STOCK,
    PERMISSIONS.CREATE_MOVEMENTS,
    PERMISSIONS.EDIT_MOVEMENTS,
    PERMISSIONS.VIEW_MOVEMENTS,
    PERMISSIONS.CREATE_COUNTING,
    PERMISSIONS.EDIT_COUNTING,
    PERMISSIONS.VIEW_COUNTING,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_AUDIT,
    PERMISSIONS.VIEW_SETTINGS
  ],
  [ROLES.VIEWER]: [
    // Visualizadores só podem ver
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_CATEGORIES,
    PERMISSIONS.VIEW_SUPPLIERS,
    PERMISSIONS.VIEW_STOCK,
    PERMISSIONS.VIEW_MOVEMENTS,
    PERMISSIONS.VIEW_COUNTING,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_SETTINGS
  ]
};

// Funções utilitárias para verificar permissões
export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Verificações específicas para facilitar o uso
export const canManageUsers = (userRole) => hasPermission(userRole, PERMISSIONS.MANAGE_USERS);
export const canEditProducts = (userRole) => hasPermission(userRole, PERMISSIONS.EDIT_PRODUCTS);
export const canDeleteProducts = (userRole) => hasPermission(userRole, PERMISSIONS.DELETE_PRODUCTS);
export const canAdjustStock = (userRole) => hasPermission(userRole, PERMISSIONS.ADJUST_STOCK);
export const canViewReports = (userRole) => hasPermission(userRole, PERMISSIONS.VIEW_REPORTS);
export const canExportReports = (userRole) => hasPermission(userRole, PERMISSIONS.EXPORT_REPORTS);
export const canViewAudit = (userRole) => hasPermission(userRole, PERMISSIONS.VIEW_AUDIT);
export const canManageSettings = (userRole) => hasPermission(userRole, PERMISSIONS.MANAGE_SETTINGS);

// Função para verificar se o usuário é admin
export const isAdmin = (userRole) => userRole === ROLES.ADMIN;

// Função para verificar se o usuário pode editar (admin ou editor)
export const canEdit = (userRole) => userRole === ROLES.ADMIN || userRole === ROLES.EDITOR;

// Função para verificar se o usuário pode apenas visualizar
export const isViewer = (userRole) => userRole === ROLES.VIEWER;
