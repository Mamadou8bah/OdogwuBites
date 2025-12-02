const express = require('express');
const { createDeliveryStaff, getAllDeliveryStaff, getDeliveryStaffById, deleteDeliveryStaff } = require('../controller/deliveryStaff');
const router = express.Router();

router.post('/', createDeliveryStaff);
router.get('/', getAllDeliveryStaff);
router.get('/:id', getDeliveryStaffById);
router.delete('/:id', deleteDeliveryStaff);

module.exports = router;
