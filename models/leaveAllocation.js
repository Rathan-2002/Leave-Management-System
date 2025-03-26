const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const LeaveType = require('./leaveType');

const LeaveAllocation = sequelize.define('LeaveAllocation', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    leaveTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Replace or add alongside allocatedDays:
    originalAllocations: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currentAllocations: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});


// Move associations to a separate function
const associate = (models) => {
    LeaveAllocation.belongsTo(models.User, { foreignKey: 'userId' });
    LeaveAllocation.belongsTo(models.LeaveType, { foreignKey: 'leaveTypeId' });
};

module.exports = { LeaveAllocation, associate };
