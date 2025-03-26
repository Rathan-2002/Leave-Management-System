'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE LeaveAllocations la
      JOIN LeaveTypes lt ON la.leaveTypeId = lt.id
      SET la.originalAllocations = lt.defaultDays,
          la.currentAllocations = lt.defaultDays
      WHERE la.originalAllocations = 0 OR la.currentAllocations = 0
    `);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE LeaveAllocations
      SET originalAllocations = 0, currentAllocations = 0
    `);
  }
};
