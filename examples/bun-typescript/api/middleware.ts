import { useLogger } from '../middlewares/logger.ts';
import { useErrorHandler } from '../middlewares/error-handler.ts';

export default [
  useErrorHandler,
  useLogger,
];