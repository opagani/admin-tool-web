import { BrowserMonitor, DatadogPlugin } from '@zg-rentals/monitor-browser';

const datadogPlugin = new DatadogPlugin({
  datadogOptions: {
    applicationId: 'cfb18872-4300-41d4-b4f6-18e6e61a753b',
    clientToken: 'pub2f1325d720e653cf87408a597737965f',
    service: __APP_NAME__,
    version: __BUILD_NUMBER__,
    env: __ZG_ENV__,
  },
});

const monitor = new BrowserMonitor({
  reporters: [],
  plugins: [datadogPlugin],
});

export default monitor;
