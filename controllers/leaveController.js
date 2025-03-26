const axios = require('axios');
const { LeaveAllocation, LeaveType, LeaveRequest } = require('../models'); // Use LeaveType (singular) consistently

// Show Apply Leave page
exports.showApplyLeave = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.findAll();
    console.log('leaveTypes:', leaveTypes);
    const user = req.session.user; // Get the user from the session

    res.render('leave/apply', { leaveTypes, user });
  } catch (error) {
    console.error('Error in showApplyLeave:', error);
    res.status(500).send('Error fetching leave types');
  }
};

// Apply Leave (handle POST request)
exports.applyLeave = async (req, res) => {
  const { leaveTypeId, startDate, endDate, comments } = req.body;
  const userId = req.session.userId;

  try {
    await LeaveRequest.create({
      userId,
      leaveTypeId,
      startDate,
      endDate,
      comments,
      status: 'pending'
    });
    res.redirect('/leave/status');
  } catch (error) {
    console.error('Error in applyLeave:', error);
    res.status(500).send('Error submitting leave request');
  }
};

// Show Leave Status page
exports.showLeaveStatus = async (req, res) => {
  const userId = req.session.userId;
  try {
    const leaveRequests = await LeaveRequest.findAll({
      where: { userId },
      include: [LeaveType]
    });
    const user = req.session.user; // Get the user from the session
    res.render('leave/status', { leaveRequests, user });
  } catch (error) {
    console.error('Error in showLeaveStatus:', error);
    res.status(500).send('Error fetching leave requests');
  }
};

// Helper function to calculate working days between two dates (excluding weekends)
// Helper function to calculate working days between two dates (excluding weekends)
// function calculateWorkingDays(startDate, endDate) {
//   let currentDate = new Date(startDate);
//   let days = 0;
//   while (currentDate <= endDate) {
//     const dayOfWeek = currentDate.getDay();
//     if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
//       days++;
//     }
//     currentDate.setDate(currentDate.getDate() + 1);
//   }
//   return days;
// }

// // Function to generate leave suggestions based on holidays and available leave balance
// function generateSuggestions(holidays, leaveBalance) {
//   const suggestions = [];
//   const today = new Date();
//   holidays.forEach((holiday) => {
//     const holidayDate = new Date(holiday.date);
//     if (holidayDate < today) return; // Skip past holidays
//     const dayOfWeek = holidayDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

//     // Suggest leave on Monday if holiday is on Tuesday, provided leave is available
//     if (dayOfWeek === 2 && leaveBalance >= 1) {
//       const suggestedDate = new Date(holidayDate);
//       suggestedDate.setDate(suggestedDate.getDate() - 1); // Monday
//       if (suggestedDate >= today) {
//         suggestions.push({
//           dates: [suggestedDate.toISOString().split('T')[0]],
//           reason: `Take leave on ${suggestedDate.toDateString()} for a 3-day break with the holiday on ${holidayDate.toDateString()}`
//         });
//       }
//     }
//     // Suggest leave on Friday if holiday is on Thursday
//     else if (dayOfWeek === 4 && leaveBalance >= 1) {
//       const suggestedDate = new Date(holidayDate);
//       suggestedDate.setDate(suggestedDate.getDate() + 1); // Friday
//       if (suggestedDate >= today) {
//         suggestions.push({
//           dates: [suggestedDate.toISOString().split('T')[0]],
//           reason: `Take leave on ${suggestedDate.toDateString()} for a 3-day break with the holiday on ${holidayDate.toDateString()}`
//         });
//       }
//     }
//   });
//   return suggestions;
// }

// exports.getLeaveSuggestions = async (req, res) => {
//   try {
//     if (!req.session.userId) {
//       return res.redirect('/account/login');
//     }

//     const country = 'IN'; // Hardcoded for India; adjust as needed
//     const year = new Date().getFullYear();

//     // Fetch holidays from Abstract API
//     const holidaysResponse = await axios.get(
//       `https://holidays.abstractapi.com/v1/?api_key=4b97974fa3804629954b0767f17df2c8&country=${country}&year=${year}`
//     );
//     const holidays = holidaysResponse.data;
//     console.log('Fetched holidays:', holidays);

//     // IMPORTANT: Use LeaveType (singular) here, not LeaveTypes.
//     const annualLeaveType = await LeaveType.findOne({ where: { name: 'Annual Leave' } });
//     if (!annualLeaveType) {
//       throw new Error('Annual Leave type not found in LeaveType table');
//     }
//     const annualLeaveTypeId = annualLeaveType.id;

//     // Get employee's leave allocation for 'Annual Leave'
//     const allocation = await LeaveAllocation.findOne({
//       where: { userId: req.session.userId, leaveTypeId: annualLeaveTypeId },
//     });

//     // Calculate used days from approved leave requests
//     const approvedRequests = await LeaveRequest.findAll({
//       where: {
//         userId: req.session.userId,
//         leaveTypeId: annualLeaveTypeId,
//         status: 'Approved'
//       },
//     });

//     let usedDays = 0;
//     approvedRequests.forEach(request => {
//       const start = new Date(request.startDate);
//       const end = new Date(request.endDate);
//       usedDays += calculateWorkingDays(start, end);
//     });

//     // Use currentAllocations as the available leave balance
//     const remainingDays = allocation ? allocation.currentAllocations : 0;
//     console.log('Remaining leave days:', remainingDays);

//     // Generate suggestions using the holidays and remaining leave balance
//     const suggestions = generateSuggestions(holidays, remainingDays);

//     res.render('leave/suggestions', { suggestions });
//   } catch (error) {
//     console.error('Error generating leave suggestions:', error.message);
//     console.error('Stack trace:', error.stack);
//     res.status(500).send('Unable to generate leave suggestions at this time.');
//   }
// };
