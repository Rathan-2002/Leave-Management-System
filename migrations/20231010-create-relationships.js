const { Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('LeaveAllocations', {
      fields: ['userId'],
      type: 'foreign key',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    await queryInterface.addConstraint('LeaveAllocations', {
      fields: ['leaveTypeId'],
      type: 'foreign key',
      references: {
        table: 'LeaveTypes',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('LeaveAllocations', 'userId');
    await queryInterface.removeConstraint('LeaveAllocations', 'leaveTypeId');
  }
};
