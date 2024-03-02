/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { jaegerEndpoint } from 'config';

export function initTrace(serviceName: string) {
  try {
    const exporter = new JaegerExporter({
      endpoint: jaegerEndpoint,
    });

    const sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
      traceExporter: exporter,
      spanProcessor: new BatchSpanProcessor(exporter),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
      }),
      instrumentations: [
        getNodeAutoInstrumentations(),
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
      ],
    });
    sdk.start();
  } catch (error) {
    console.log(error.message);
  }
}
