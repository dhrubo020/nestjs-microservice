import { trace, Span, context, SpanContext } from '@opentelemetry/api';

export interface ICreateTracerRes {
  span: Span;
  spanContext: SpanContext;
}

export function newTracer(
  name: string,
  attributes?: Record<string, any>,
): ICreateTracerRes {
  const tracer = trace.getTracer(name);
  const span = tracer.startSpan(name, attributes || {});
  const spanContext = span.spanContext();
  return { span, spanContext };
}

export function newSpan(name: string, spanContext: SpanContext): Span {
  console.log('Creating new span form', name);
  const parentContext = trace.setSpanContext(context.active(), spanContext);
  const span = trace.getTracer(name).startSpan(name, {}, parentContext);
  return span;
}
