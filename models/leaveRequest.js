const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const User = require('./user');
// const LeaveType = require('./leaveType');
const LeaveRequest = sequelize.define('LeaveRequest', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    leaveTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    comments: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true
});


// LeaveRequest.belongsTo(User, { foreignKey: 'userId' });
// LeaveRequest.belongsTo(LeaveType, { foreignKey: 'leaveTypeId' });

module.exports = LeaveRequest;