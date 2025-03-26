const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Import all models
const { User, associate: userAssociations } = require('./user');
const { LeaveAllocation, associate: leaveAllocationAssociations } = require('./leaveAllocation');
const LeaveRequest = require('./leaveRequest');
const LeaveType = require('./leaveType');

// Define associations
userAssociations({ LeaveAllocation }); // Pass LeaveAllocation to associate with User
leaveAllocationAssociations({ User, LeaveType }); // Pass User and LeaveType to associate with LeaveAllocation

// If you have associations for LeaveRequest, define them as well
User.hasMany(LeaveRequest, { foreignKey: 'userId' });
LeaveRequest.belongsTo(User, { foreignKey: 'userId' });

LeaveType.hasMany(LeaveRequest, { foreignKey: 'leaveTypeId' });
LeaveRequest.belongsTo(LeaveType, { foreignKey: 'leaveTypeId' });

// Export models
module.exports = {
    sequelize,
    User,
    LeaveAllocation,
    LeaveRequest,
    LeaveType,
};
