'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the allocatedDays column from LeaveAllocations table
    await queryInterface.removeColumn('LeaveAllocations', 'allocatedDays');
  },

  down: async (queryInterface, Sequelize) => {
    // If you want to revert, add the column back (you may need to adjust the settings)
    await queryInterface.addColumn('LeaveAllocations', 'allocatedDays', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  }
};
