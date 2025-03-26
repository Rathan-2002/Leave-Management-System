const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Existing routes for requests, employees, and allocations
router.get('/requests', adminAuth, adminController.showRequestList);
router.get('/approve/:id', adminAuth, adminController.approveRequest);
router.get('/reject/:id', adminAuth, adminController.rejectRequest);
router.get('/employees', adminAuth, adminController.showEmployeeList);
router.get('/allocations', adminAuth, adminController.showAllocations);

router.get('/allocations/new', adminAuth, adminController.showAddAllocation);
router.post('/allocations/new', adminAuth, adminController.addAllocation);
router.get('/allocations/view/:id', adminAuth, adminController.viewAllocation);



// Leave Types
router.get('/leave-types', adminAuth, adminController.showLeaveTypes);
router.get('/leave-types/new', adminAuth, adminController.showAddLeaveType);
router.post('/leave-types', adminAuth, adminController.addLeaveType);
router.get('/leave-types/edit/:id', adminAuth, adminController.showEditLeaveType);
router.post('/leave-types/edit/:id', adminAuth, adminController.editLeaveType);
router.post('/leave-types/delete/:id', adminAuth, adminController.deleteLeaveType);
router.get('/allocations/view/:id', adminAuth, adminController.viewAllocation);


module.exports = router;