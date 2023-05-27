import { BrowserTracer } from '@zg-rentals/trace-browser';
import monitor from './monitor';

const tracer = new BrowserTracer(monitor);

export default tracer;
