import { Counter, Histogram } from 'prom-client';
import * as responseTime from 'response-time';

const reqResTime = new Histogram({
  name: 'req_res_time',
  help: 'Req res time',
  labelNames: ['method', 'route', 'statusCode'],
  buckets: [0, 50, 100, 200, 500, 1000, 2000],
});

const totalReqCounter = new Counter({
  name: 'total_req_count',
  help: 'Total req count',
});

export const ResponseTimeMiddleware = responseTime((req, res, time) => {
  totalReqCounter.inc();
  reqResTime
    .labels({
      method: req.method,
      route: req.url,
      statusCode: res.statusCode,
    })
    .observe(time);
});
