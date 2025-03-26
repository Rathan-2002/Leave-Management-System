// updateExistingAllocations.js
const { User, LeaveType, LeaveAllocation } = require('./models');

const updateExistingAllocations = async () => {
  try {
    const employees = await User.findAll({ where: { role: 'employee' } });
    const leaveTypes = await LeaveType.findAll();
    
    for (const employee of employees) {
      for (const type of leaveTypes) {
        const allocation = await LeaveAllocation.findOne({
          where: {
            userId: employee.id,
            leaveTypeId: type.id
          }
        });
        if (!allocation) {
          await LeaveAllocation.create({
            userId: employee.id,
            leaveTypeId: type.id,
            originalAllocations: type.defaultDays,
            currentAllocations: type.defaultDays
          });
          console.log(`Created allocation for ${employee.firstName} ${employee.lastName} for ${type.name}`);
        }
      }
    }
    console.log('Existing allocations updated successfully.');
  } catch (error) {
    console.error('Error updating existing allocations:', error);
  }
};

updateExistingAllocations();
