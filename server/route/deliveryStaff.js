const express = require('express');
const { createDeliveryStaff, getAllDeliveryStaff, getDeliveryStaffById, deleteDeliveryStaff, updateDeliveryStaff } = require('../controller/deliveryStaff');
const router = express.Router();

router.post('/', createDeliveryStaff);
router.get('/', getAllDeliveryStaff);
router.get('/:id', getDeliveryStaffById);
router.delete('/:id', deleteDeliveryStaff);
router.put('/:id', updateDeliveryStaff);

module.exports = router;
