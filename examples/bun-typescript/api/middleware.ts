import { useLogger } from '../middlewares/logger.ts';
import { useErrorHandler } from '../middlewares/error-handler.ts';
import { useCors } from '../middlewares/cors.ts';

export default [
  useErrorHandler,
  useCors,
  useLogger,
];