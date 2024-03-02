// export const localIp = '172.18.105.191';
export const localIp = 'http://54.175.99.111';
export const amqpUrl = `amqp://${localIp}:5672` || '';
export const lokiHostUrl = `http://${localIp}:3100` || '';
export const jaegerEndpoint = `http://${localIp}:14268/api/traces`;
