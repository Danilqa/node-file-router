import { useAuth } from '../middlewares/cors';
import { useLogger } from '../middlewares/logger';

export default [
  useLogger,
  useAuth
];