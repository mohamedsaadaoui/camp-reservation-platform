const Eureka = require('eureka-js-client').Eureka;

const enabled = process.env.EUREKA_ENABLED === 'true';
const hostname = process.env.EUREKA_HOSTNAME || 'reservation-service';
const PORT = process.env.PORT || 3000;

const client = new Eureka({
  instance: {
    app: 'reservation-service',
    hostName: hostname,
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://${hostname}:${PORT}/health`,
    healthCheckUrl: `http://${hostname}:${PORT}/health`,
    port: {
      $: PORT,
      '@enabled': 'true'
    },
    vipAddress: 'reservation-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'localhost',
    port: process.env.EUREKA_PORT || 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 5,
    requestRetryDelay: 2000
  }
});

const state = { registered: false };

const start = () => {
  if (!enabled) {
    console.log('Eureka registration disabled (set EUREKA_ENABLED=true to enable)');
    return;
  }
  client.on('registered', () => {
    state.registered = true;
    console.log('Registered with Eureka');
  });
  client.on('deregistered', () => {
    state.registered = false;
  });
  client.on('error', (error) => {
    console.error('Eureka error:', error.message);
  });
  client.start((error) => {
    if (error) {
      console.error('Eureka start error:', error.message);
    }
  });
};

const stop = () => {
  if (enabled) {
    client.stop();
  }
};

module.exports = { start, stop, state };
