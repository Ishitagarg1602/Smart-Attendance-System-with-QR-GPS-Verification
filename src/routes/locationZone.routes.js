import express from 'express';
import { createZone, getAllZones, updateZone, deleteZone } from '../controllers/locationZone.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('Admin'), createZone)
  .get(getAllZones);

router.route('/:id')
  .put(authorize('Admin'), updateZone)
  .delete(authorize('Admin'), deleteZone);

export default router;
