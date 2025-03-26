const { User, LeaveType, LeaveAllocation, LeaveRequest } = require('../models');

// Employee List
exports.showEmployeeList = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        });
        res.render('admin/employees', { users });
    } catch (error) {
        res.status(500).send('Error fetching employee list');
    }
};

// Leave Allocations
exports.showAllocations = async (req, res) => {
    try {
        const allocations = await LeaveAllocation.findAll({
            include: [
                { model: User, where: { role: 'employee' } },
                LeaveType
            ],
            order: [[{ model: User }, 'firstName', 'ASC']]
        });
        res.render('admin/allocations', { allocations });
    } catch (error) {
        res.status(500).send('Error fetching leave allocations');
    }
};

// Leave Requests
exports.showRequestList = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.findAll({
            include: [User, LeaveType]
        });
        res.render('admin/requests', { leaveRequests });
    } catch (error) {
        res.status(500).send('Error fetching leave requests');
    }
};

// exports.approveRequest = async (req, res) => {
//     const { id } = req.params;
//     try {
//         await LeaveRequest.update({ status: 'approved' }, { where: { id } });
//         res.redirect('/admin/requests');
//     } catch (error) {
//         res.status(500).send('Error approving request');
//     }
// };

exports.rejectRequest = async (req, res) => {
    const { id } = req.params;
    try {
        await LeaveRequest.update({ status: 'rejected' }, { where: { id } });
        res.redirect('/admin/requests');
    } catch (error) {
        res.status(500).send('Error rejecting request');
    }
};

// Leave Types
exports.showLeaveTypes = async (req, res) => {
    try {
        const leaveTypes = await LeaveType.findAll();
        res.render('admin/leaveTypes', { leaveTypes });
    } catch (error) {
        res.status(500).send('Error fetching leave types');
    }
};

exports.showAddLeaveType = (req, res) => {
    res.render('admin/leaveTypeForm', { isEdit: false, leaveType: null });
};

exports.addLeaveType = async (req, res) => {
    const { name, defaultDays } = req.body;
    try {
        // Create the new leave type
        const leaveType = await LeaveType.create({ name, defaultDays });
        
        // Get all employees (assuming role is 'employee')
        const employees = await User.findAll({ where: { role: 'employee' } });
        
        // For each employee, check if an allocation for this leave type exists, if not, create it
        for (const employee of employees) {
            const allocation = await LeaveAllocation.findOne({
                where: {
                    userId: employee.id,
                    leaveTypeId: leaveType.id
                }
            });
            if (!allocation) {
                await LeaveAllocation.create({
                    userId: employee.id,
                    leaveTypeId: leaveType.id,
                    originalAllocations: defaultDays,
                    currentAllocations: defaultDays
                });
            }
        }
        res.redirect('/admin/leave-types');
    } catch (error) {
        console.error('Error adding leave type:', error);
        res.status(500).send('Error adding leave type');
    }
};


exports.showEditLeaveType = async (req, res) => {
    const { id } = req.params;
    try {
        const leaveType = await LeaveType.findByPk(id);
        if (!leaveType) {
            return res.status(404).send('Leave type not found');
        }
        res.render('admin/leaveTypeForm', { isEdit: true, leaveType });
    } catch (error) {
        res.status(500).send('Error fetching leave type');
    }
};

exports.editLeaveType = async (req, res) => {
    const { id } = req.params;
    const { name, defaultDays } = req.body;
    try {
        const leaveType = await LeaveType.findByPk(id);
        if (!leaveType) {
            return res.status(404).send('Leave type not found');
        }
        leaveType.name = name;
        leaveType.defaultDays = defaultDays;
        await leaveType.save();
        res.redirect('/admin/leave-types');
    } catch (error) {
        res.status(500).send('Error updating leave type');
    }
};

exports.deleteLeaveType = async (req, res) => {
    const { id } = req.params;
    try {
        const leaveType = await LeaveType.findByPk(id);
        if (!leaveType) {
            return res.status(404).send('Leave type not found');
        }
        // Check for any leave requests using this leave type
        const requests = await LeaveRequest.findAll({ where: { leaveTypeId: id } });
        if (requests.length > 0) {
            return res.status(400).send('Cannot delete leave type that is in use');
        }

        // Optionally, delete associated leave allocations to satisfy foreign key constraints
        await LeaveAllocation.destroy({ where: { leaveTypeId: id } });
        
        // Now delete the leave type
        await leaveType.destroy();
        res.redirect('/admin/leave-types');
    } catch (error) {
        console.error('Error deleting leave type:', error);
        res.status(500).send('Error deleting leave type');
    }
};

// Detailed view for a specific allocation
exports.viewAllocation = async (req, res) => {
    const { id } = req.params;
    try {
        const allocation = await LeaveAllocation.findByPk(id, {
            include: [
                { model: User },
                LeaveType
            ]
        });
        if (!allocation) {
            return res.status(404).send('Allocation not found');
        }
        res.render('admin/allocationDetail', { allocation });
    } catch (error) {
        res.status(500).send('Error fetching allocation details');
    }
};


// Existing methods ...

// Add Allocation - Render form
exports.showAddAllocation = async (req, res) => {
    try {
        // Fetch all employees and leave types to populate dropdowns in the form
        const users = await User.findAll({ where: { role: 'employee' } });
        const leaveTypes = await LeaveType.findAll();
        res.render('admin/allocationForm', { users, leaveTypes });
    } catch (error) {
        res.status(500).send('Error displaying allocation form');
    }
};

// Add Allocation - Process form submission
exports.addAllocation = async (req, res) => {
    try {
        const { userId, leaveTypeId, allocatedDays } = req.body;
        // Optionally, log the received data
        console.log('Form Data:', req.body);

        // Parse the allocatedDays as integer
        const days = parseInt(allocatedDays, 10);
        await LeaveAllocation.create({
            userId,
            leaveTypeId,
            originalAllocations: days,
            currentAllocations: days
        });
        res.redirect('/admin/allocations');
    } catch (error) {
        console.error('Error creating allocation:', error);
        res.status(500).send('Error creating leave allocation');
    }
};



exports.approveRequest = async (req, res) => {
    const { id } = req.params;
    try {
        // Update the leave request status first
        await LeaveRequest.update({ status: 'approved' }, { where: { id } });
        
        // Fetch the approved leave request record
        const leaveRequest = await LeaveRequest.findByPk(id);
        if (!leaveRequest) {
            return res.status(404).send('Leave request not found');
        }

        const start = new Date(leaveRequest.startDate);
        const end = new Date(leaveRequest.endDate);
        const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
        const leaveDays = Math.round(Math.abs((end - start) / oneDay)) + 1; // Including both start and end dates
        
        // Find the corresponding leave allocation for the user and leave type
        const allocation = await LeaveAllocation.findOne({
            where: {
                userId: leaveRequest.userId,
                leaveTypeId: leaveRequest.leaveTypeId
            }
        });
        
        if (!allocation) {
            return res.status(404).send('Leave allocation not found');
        }
        
        // Check if the employee has enough current allocations
        if (allocation.currentAllocations < leaveDays) {
            return res.status(400).send('Insufficient leave balance');
        }
        
        // Deduct the leave days
        console.log('Before saving, currentAllocations:', allocation.currentAllocations);
        allocation.currentAllocations -= leaveDays;
        console.log('After deduction, currentAllocations:', allocation.currentAllocations);
        await allocation.save();
        console.log('Allocation saved successfully');

        
        res.redirect('/admin/requests');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error approving request');
    }
};

// Existing methods continue...
