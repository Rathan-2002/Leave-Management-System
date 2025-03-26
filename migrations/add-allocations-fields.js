module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('LeaveAllocations', 'originalAllocations', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
      await queryInterface.addColumn('LeaveAllocations', 'currentAllocations', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('LeaveAllocations', 'originalAllocations');
      await queryInterface.removeColumn('LeaveAllocations', 'currentAllocations');
    }
  };
  