/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

// Root
const authRoot = 'auth';
const membersRoot = 'members';
const productsRoot = 'products';
const transactionsRoot = 'transactions';
// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  auth: {
    root: authRoot,
    post: {
      register: `/${authRoot}/register`,
      emailLogIn: `/${authRoot}/log-in/email`,
      kakaoLogin: `/${authRoot}/log-in/kakao`,
      naverLogin: `/${authRoot}/log-in/naver`,
      logOut: `/${authRoot}/log-out`,
    },
  },
  member: {
    root: membersRoot,
  },
  product: {
    root: productsRoot,
    get: {
      getProductById: `/${productsRoot}/:productId`,
      getProducts: `/${productsRoot}`,
    },
    post: {
      createProduct: `/${productsRoot}`,
    },
  },
  transaction: {
    root: transactionsRoot,
    post: {
      createTransaction: `/${transactionsRoot}`,
    },
    patch: {
      approveSale: `${transactionsRoot}/:transactionId/approve-sale`,
      confirmPurchase: `${transactionsRoot}/:transactionId/confirm-purchase`,
    },
    get: {
      getReservationList: `${transactionsRoot}/reservation-list`,
      getPurchaseList: `${transactionsRoot}/purchase-list`,
      getTransactionsOfSellerAndBuyer: `${transactionsRoot}`,
    }
  },
};
