import { useAuth } from '../middlewares/cors';
import { useLogger } from '../middlewares/logger';
import { useErrorHandler } from '../middlewares/error-handler';

export default [
  useErrorHandler,
  useLogger,
  useAuth
];