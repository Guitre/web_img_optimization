import { Router } from 'express';
import { statusController } from './status.controller';
const router = Router();
router.get('/:taskId', statusController);
export default router;
