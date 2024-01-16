import { useErrorHandler } from '../middlewares/error-handler';
import { useLogger } from '../middlewares/logger';
import { useAuth } from '../middlewares/auth';

export default [
  useErrorHandler,
  useLogger,
  useAuth,
];