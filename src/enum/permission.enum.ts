export enum PermissionEnum {
  // Usuarios
  USER_CREATE = 'user.create',
  USER_READ = 'user.read',
  USER_UPDATE = 'user.update',
  USER_SOFT_DELETE = 'user.soft_delete',
  USER_HARD_DELETE = 'user.hard_delete',
  USER_RESTORE = 'user.restore',

  // Roles
  ROLE_CREATE = 'role.create',
  ROLE_READ = 'role.read',
  ROLE_UPDATE = 'role.update',
  ROLE_SOFT_DELETE = 'role.soft_delete',
  ROLE_HARD_DELETE = 'role.hard_delete',
  ROLE_RESTORE = 'role.restore',

  // Nota de Venta
  SALE_NOTE_CREATE = 'sale_note.create',
  SALE_NOTE_READ = 'sale_note.read',
  SALE_NOTE_UPDATE = 'sale_note.update',
  SALE_NOTE_SOFT_DELETE = 'sale_note.soft_delete',
  SALE_NOTE_HARD_DELETE = 'sale_note.hard_delete',
  SALE_NOTE_RESTORE = 'sale_note.restore',

  // Detalle de Venta
  SALE_DETAIL_CREATE = 'sale_detail.create',
  SALE_DETAIL_READ = 'sale_detail.read',
  SALE_DETAIL_UPDATE = 'sale_detail.update',
  SALE_DETAIL_SOFT_DELETE = 'sale_detail.soft_delete',
  SALE_DETAIL_HARD_DELETE = 'sale_detail.hard_delete',
  SALE_DETAIL_RESTORE = 'sale_detail.restore',

  // Nota de Ingreso
  INCOME_NOTE_CREATE = 'income_note.create',
  INCOME_NOTE_READ = 'income_note.read',
  INCOME_NOTE_UPDATE = 'income_note.update',
  INCOME_NOTE_SOFT_DELETE = 'income_note.soft_delete',
  INCOME_NOTE_HARD_DELETE = 'income_note.hard_delete',
  INCOME_NOTE_RESTORE = 'income_note.restore',

  // Detalle de Ingreso
  INCOME_DETAIL_CREATE = 'income_detail.create',
  INCOME_DETAIL_READ = 'income_detail.read',
  INCOME_DETAIL_UPDATE = 'income_detail.update',
  INCOME_DETAIL_SOFT_DELETE = 'income_detail.soft_delete',
  INCOME_DETAIL_HARD_DELETE = 'income_detail.hard_delete',
  INCOME_DETAIL_RESTORE = 'income_detail.restore',

  // Nota de Egreso
  EXPENSE_NOTE_CREATE = 'expense_note.create',
  EXPENSE_NOTE_READ = 'expense_note.read',
  EXPENSE_NOTE_UPDATE = 'expense_note.update',
  EXPENSE_NOTE_SOFT_DELETE = 'expense_note.soft_delete',
  EXPENSE_NOTE_HARD_DELETE = 'expense_note.hard_delete',
  EXPENSE_NOTE_RESTORE = 'expense_note.restore',

  // Detalle de Egreso
  EXPENSE_DETAIL_CREATE = 'expense_detail.create',
  EXPENSE_DETAIL_READ = 'expense_detail.read',
  EXPENSE_DETAIL_UPDATE = 'expense_detail.update',
  EXPENSE_DETAIL_SOFT_DELETE = 'expense_detail.soft_delete',
  EXPENSE_DETAIL_HARD_DELETE = 'expense_detail.hard_delete',
  EXPENSE_DETAIL_RESTORE = 'expense_detail.restore',

  // Depósito
  WAREHOUSE_CREATE = 'warehouse.create',
  WAREHOUSE_READ = 'warehouse.read',
  WAREHOUSE_UPDATE = 'warehouse.update',
  WAREHOUSE_SOFT_DELETE = 'warehouse.soft_delete',
  WAREHOUSE_HARD_DELETE = 'warehouse.hard_delete',
  WAREHOUSE_RESTORE = 'warehouse.restore',

  // Producto-Depósito
  PRODUCT_WAREHOUSE_CREATE = 'product_warehouse.create',
  PRODUCT_WAREHOUSE_READ = 'product_warehouse.read',
  PRODUCT_WAREHOUSE_UPDATE = 'product_warehouse.update',
  PRODUCT_WAREHOUSE_SOFT_DELETE = 'product_warehouse.soft_delete',
  PRODUCT_WAREHOUSE_HARD_DELETE = 'product_warehouse.hard_delete',
  PRODUCT_WAREHOUSE_RESTORE = 'product_warehouse.restore',

  // Producto
  PRODUCT_CREATE = 'product.create',
  PRODUCT_READ = 'product.read',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_SOFT_DELETE = 'product.soft_delete',
  PRODUCT_HARD_DELETE = 'product.hard_delete',
  PRODUCT_RESTORE = 'product.restore',

  // Imágenes
  IMAGE_CREATE = 'image.create',
  IMAGE_READ = 'image.read',
  IMAGE_UPDATE = 'image.update',
  IMAGE_SOFT_DELETE = 'image.soft_delete',
  IMAGE_HARD_DELETE = 'image.hard_delete',
  IMAGE_RESTORE = 'image.restore',

  // Tipo de Producto
  PRODUCT_TYPE_CREATE = 'product_type.create',
  PRODUCT_TYPE_READ = 'product_type.read',
  PRODUCT_TYPE_UPDATE = 'product_type.update',
  PRODUCT_TYPE_SOFT_DELETE = 'product_type.soft_delete',
  PRODUCT_TYPE_HARD_DELETE = 'product_type.hard_delete',
  PRODUCT_TYPE_RESTORE = 'product_type.restore',

  // Tipo de Categoría
  CATEGORY_TYPE_CREATE = 'category_type.create',
  CATEGORY_TYPE_READ = 'category_type.read',
  CATEGORY_TYPE_UPDATE = 'category_type.update',
  CATEGORY_TYPE_SOFT_DELETE = 'category_type.soft_delete',
  CATEGORY_TYPE_HARD_DELETE = 'category_type.hard_delete',
  CATEGORY_TYPE_RESTORE = 'category_type.restore',

  // Categoría
  CATEGORY_CREATE = 'category.create',
  CATEGORY_READ = 'category.read',
  CATEGORY_UPDATE = 'category.update',
  CATEGORY_SOFT_DELETE = 'category.soft_delete',
  CATEGORY_HARD_DELETE = 'category.hard_delete',
  CATEGORY_RESTORE = 'category.restore',

  // Compatibilidad
  COMPATIBILITY_CREATE = 'compatibility.create',
  COMPATIBILITY_READ = 'compatibility.read',
  COMPATIBILITY_UPDATE = 'compatibility.update',
  COMPATIBILITY_SOFT_DELETE = 'compatibility.soft_delete',
  COMPATIBILITY_HARD_DELETE = 'compatibility.hard_delete',
  COMPATIBILITY_RESTORE = 'compatibility.restore',

  // Modelo
  MODEL_CREATE = 'model.create',
  MODEL_READ = 'model.read',
  MODEL_UPDATE = 'model.update',
  MODEL_SOFT_DELETE = 'model.soft_delete',
  MODEL_HARD_DELETE = 'model.hard_delete',
  MODEL_RESTORE = 'model.restore',

  // Marca
  BRAND_CREATE = 'brand.create',
  BRAND_READ = 'brand.read',
  BRAND_UPDATE = 'brand.update',
  BRAND_SOFT_DELETE = 'brand.soft_delete',
  BRAND_HARD_DELETE = 'brand.hard_delete',
  BRAND_RESTORE = 'brand.restore',

  // Metricas
  METRICS_CREATE = 'metrics.create',
  METRICS_READ = 'metrics.read',
  METRICS_UPDATE = 'metrics.update',
  METRICS_SOFT_DELETE = 'metrics.soft_delete',
  METRICS_HARD_DELETE = 'metrics.hard_delete',
  METRICS_RESTORE = 'metrics.restore',
  
  // Características
  CHARACTERISTICS_CREATE = 'characteristics.create',
  CHARACTERISTICS_READ = 'characteristics.read',
  CHARACTERISTICS_UPDATE = 'characteristics.update',
  CHARACTERISTICS_SOFT_DELETE = 'characteristics.soft_delete',
  CHARACTERISTICS_HARD_DELETE = 'characteristics.hard_delete',
  CHARACTERISTICS_RESTORE = 'characteristics.restore',
}
