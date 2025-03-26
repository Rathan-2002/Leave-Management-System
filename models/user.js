const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 100]  // For example, password must be at least 6 characters
        }
      },
    role: {
        type: DataTypes.ENUM('Employee', 'admin'),
        defaultValue: 'Employee'
    }
}, {
    timestamps: true
});

const LeaveAllocation = require('./leaveAllocation'); // Import LeaveAllocation model

// Move associations to a separate function
const associate = (models) => {
    User.hasMany(models.LeaveAllocation, { foreignKey: 'userId' });
};

module.exports = { User, associate };


