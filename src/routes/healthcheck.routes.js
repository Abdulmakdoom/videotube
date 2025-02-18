import { Router } from 'express';
import { heckcheckContoller } from "../controllers/healthcheck.controller.js"

const router = Router();

router.route('/').get(heckcheckContoller);

export default router