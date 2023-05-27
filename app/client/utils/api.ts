const BASE = __ZG_ENV__ !== 'production-docker' ? __API__ : '';
const RADMIN_BASE_URL = __ZG_ENV__ == 'production-docker' ? 'https://rent-payment.hotpads.com' : 'https://comet1.testpads.net';

export const api = {
  auth: {
    check: `${BASE}/rent-guarantee/hostedAuth/check`,
    redirect: (path: string) => `${BASE}/rent-guarantee/hostedAuth/forward?callbackUrl=${path}`,
    signout: `${BASE}/rent-guarantee/signout`,
  },
  radmin: {
    redirect: (paymentId: number) =>
      `${RADMIN_BASE_URL}/rent-payment/adminTool/view/viewPropertyRentSchedule?searchBy=relationshipId&id=${paymentId}`
  }
};
