const PRODUCT_REPOSITORY = Symbol('ProductRepository');
const PRODUCT_INVENTORY_REPOSITORY = Symbol('ProductInventoryRepository');

export const DIToken = {
  PRODUCT_REPOSITORY,
  PRODUCT_INVENTORY_REPOSITORY,
} as const;
