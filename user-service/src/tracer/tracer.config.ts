/*instrumentation.ts*/
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export function initTrace(serviceName: string) {
  let exporter: JaegerExporter;
  try {
    exporter = new JaegerExporter({
      endpoint: 'http://localhost:14268/api/traces',
    });
    if (!exporter) {
      console.log('Error');
    }

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
