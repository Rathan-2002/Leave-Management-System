const LeaveType = require('./leaveType');


const seedLeaveTypes = async () => {
    const leaveTypes = [
        { name: 'Sick Leave', defaultDays: 10 },
        { name: 'Casual Leave', defaultDays: 12 },
        { name: 'Annual Leave', defaultDays: 15 }
    ];

    try {
        await LeaveType.bulkCreate(leaveTypes);
        console.log('Leave types seeded successfully!');
    } catch (error) {
        console.error('Error seeding leave types:', error);
    }
};

seedLeaveTypes();
