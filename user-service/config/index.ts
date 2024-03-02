export const localIp = '192.168.148.247';
export const amqpUrl = `amqp://${localIp}:5672` || '';
export const lokiHostUrl = `http://${localIp}:3100` || '';
export const jaegerEndpoint = `http://${localIp}:14268/api/traces`;
