import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  trace,
  Span,
  propagation,
  context,
  ROOT_CONTEXT,
  createContextKey,
  Context,
} from '@opentelemetry/api';
import { Tracer } from '@opentelemetry/sdk-trace-node';

export interface ICreateTracer {
  name: string;
  attributes?: Record<string, any>;
}

export interface ICreateTracerRes {
  tracer: Tracer;
  span: Span;
  ctx: Context;
}
export const GetTracer = createParamDecorator<ICreateTracer>(
  async (data: ICreateTracer, context: ExecutionContext) => {
    const { name, attributes } = data;
    // const tracer = tracerProvider.getTracer('express-tracer');
    // const span = tracer.startSpan('hira');
    // // Add custom attributes or log additional information if needed
    // span.setAttribute('user', 'user made');
    // // Pass the span to the request object for use in the route handler
    // context.with(trace.setSpan(context.active(), span), () => {
    //   next();
    // });

    const tracer = trace.getTracer(name);
    const ctx = ROOT_CONTEXT;
    const span = tracer.startSpan(name, attributes, ctx);
    const track = { tracer, span, ctx };
    return track as ICreateTracerRes;
  },
);
