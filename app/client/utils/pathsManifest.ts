import { registerBrowserRoutes } from '@zg-rentals/route-list';

const pathsManifest = {
  searchPolicies: '/rent-guarantee/adminApp',
  reports: '/rent-guarantee/adminApp/reports',
};

registerBrowserRoutes(pathsManifest);

export default pathsManifest;
