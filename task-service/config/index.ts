export const localIp = '54.175.99.111';
const monitoringIp = '54.145.6.11';

const rabbitMq = process.env.RABBIT_MQ

export const lokiHostUrl = `http://${monitoringIp}:3100` || '';

export const amqpUrl = rabbitMq || '';
export const jaegerEndpoint = `http://${localIp}:14268/api/traces`;
