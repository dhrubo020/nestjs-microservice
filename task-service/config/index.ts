const {
  DB,
  MONGODB_URI,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

export const localIp = '172.18.105.191';
export const amqpUrl = `amqp://${localIp}:5672` || '';
export const lokiHostUrl = `http://${localIp}:3100` || '';
export const jaegerEndpoint = `http://${localIp}:14268/api/traces`;

export const mongoUrl =
  'mongodb+srv://dnsdhrubo:jVGflASJlCR5Xy2B@cluster0.xhxuxg5.mongodb.net/bio-nippy-dev';

export const dbConfig = {
  mongodb: {
    URI:
      MONGODB_URI ||
      'mongodb+srv://dnsdhrubo:jVGflASJlCR5Xy2B@cluster0.xhxuxg5.mongodb.net/bio-nippy-dev',
  },
  mysql: {
    host: MYSQL_HOST || 'localhost',
    port: parseInt(MYSQL_PORT) || 3306,
    username: MYSQL_USERNAME || 'root',
    password: MYSQL_PASSWORD || '1234',
    database: MYSQL_DATABASE || 'user-posts',
  },
};
