import { Router } from 'express';

import { healthCheck } from '../controllers/healthCheck.controller';

const router = Router();

// secure routes
router.route("/health-check").get(healthCheck);

export default router;
