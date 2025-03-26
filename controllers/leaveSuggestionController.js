const { User, LeaveAllocation, LeaveRequest, LeaveType } = require('../models');
const { getHolidays, generateFixedHolidays, mergeHolidays } = require('../utils/holidayService');

/**
 * Helper function: Calculate working days between two dates (excluding weekends).
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {number} - Number of working days.
 */
function calculateWorkingDays(startDate, endDate) {
  let current = new Date(startDate);
  let count = 0;
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/**
 * Generate leave suggestions based on holidays and available leave balance.
 * Suggests:
 *  - Monday if a holiday is on Tuesday.
 *  - Friday if a holiday is on Thursday.
 * @param {Array} holidays - Array of holiday objects.
 * @param {number} leaveBalance - Remaining leave days.
 * @returns {Array} - Array of suggestion objects.
 */
function generateSuggestions(holidays, leaveBalance) {
  const suggestions = [];
  const today = new Date();
  
  holidays.forEach(holiday => {
    const holidayDate = new Date(holiday.date);
    if (holidayDate < today) return; // Skip past holidays
    const dayOfWeek = holidayDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

    // If holiday is on Tuesday (2), suggest taking leave on Monday (1)
    if (dayOfWeek === 2 && leaveBalance >= 1) {
      const suggestedDate = new Date(holidayDate);
      suggestedDate.setDate(suggestedDate.getDate() - 1);
      if (suggestedDate >= today) {
        suggestions.push({
          dates: [suggestedDate.toISOString().split('T')[0]],
          reason: `Take leave on ${suggestedDate.toDateString()} for a long weekend (holiday on ${holidayDate.toDateString()}).`
        });
      }
    }
    // If holiday is on Thursday (4), suggest taking leave on Friday (5)
    else if (dayOfWeek === 4 && leaveBalance >= 1) {
      const suggestedDate = new Date(holidayDate);
      suggestedDate.setDate(suggestedDate.getDate() + 1);
      if (suggestedDate >= today) {
        suggestions.push({
          dates: [suggestedDate.toISOString().split('T')[0]],
          reason: `Take leave on ${suggestedDate.toDateString()} for a long weekend (holiday on ${holidayDate.toDateString()}).`
        });
      }
    }
  });
  
  return suggestions;
}

/**
 * Controller function to generate leave suggestions.
 * It uses:
 * 1. Employee's leave allocation for "Annual Leave".
 * 2. Approved leave requests to infer usage (optional).
 * 3. Holiday suggestions from Calendarific API merged with fixed holidays.
 */

/**
 * Controller function to generate leave suggestions.
 */
exports.suggestLeave = async (req, res) => {
  try {
    if (!req.session.userId) {
      console.log("Session userId is not set."); // Debugging
      return res.redirect('/account/login');
    }

    const user = await User.findByPk(req.session.userId);
    console.log("User fetched:", user); // Debugging
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const year = new Date().getFullYear();
    const country = user.country || 'IN'; // Default to India if country not set
    console.log("Country for holidays:", country); // Debugging

    // Fetch holidays from Calendarific API
    const apiHolidays = await getHolidays(country, year);
    console.log("API Holidays fetched:", apiHolidays); // Debugging

    // Generate fixed holidays (every Sunday and second Saturday)
    const fixedHolidays = generateFixedHolidays(year);
    console.log("Fixed Holidays generated:", fixedHolidays); // Debugging

    // Merge both lists
    const allHolidays = mergeHolidays(apiHolidays, fixedHolidays);
    console.log("Merged holidays:", allHolidays); // Debugging

    // Retrieve the "Annual Leave" type from the LeaveType table
    const annualLeaveType = await LeaveType.findOne({ where: { name: 'Annual Leave' } });
    console.log("Annual Leave Type:", annualLeaveType); // Debugging
    if (!annualLeaveType) {
      throw new Error('Annual Leave type not found in LeaveType table');
    }

    // Get the user's leave allocation for Annual Leave
    const allocation = await LeaveAllocation.findOne({
      where: { userId: user.id, leaveTypeId: annualLeaveType.id }
    });
    const remainingDays = allocation ? allocation.currentAllocations : 0;
    console.log("Remaining leave days:", remainingDays); // Debugging

    // Calculate used leave days from approved leave requests
    const approvedRequests = await LeaveRequest.findAll({
      where: { userId: user.id, leaveTypeId: annualLeaveType.id, status: 'Approved' },
    });
    let usedDays = 0;
    approvedRequests.forEach(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      usedDays += calculateWorkingDays(start, end);
    });
    console.log("Used leave days:", usedDays); // Debugging

    // Generate leave suggestions
    const suggestions = generateSuggestions(allHolidays, remainingDays);
    console.log("Leave suggestions:", suggestions); // Debugging

    // Render suggestions view
    res.render('leave/suggestions', { suggestions });
  } catch (error) {
    console.error("▶ Error generating leave suggestions:", error.message);
    console.error("▶ Stack trace:", error.stack);
    res.status(500).send("Unable to generate leave suggestions at this time.");
  }
};


// ORIGINAL

// exports.suggestLeave = async (req, res) => {
//   try {
//     if (!req.session.userId) {
//       return res.redirect('/account/login');
//     }
//     const user = await User.findByPk(req.session.userId);
//     if (!user) return res.status(404).json({ error: "User not found" });
    
//     const year = new Date().getFullYear();
//     const country = user.country || 'IN'; // Use user's country if set, else default to India
    
//     // Fetch holidays from Calendarific API
//     const apiHolidays = await getHolidays(country, year);
//     // Generate fixed holidays (every Sunday and second Saturday)
//     const fixedHolidays = generateFixedHolidays(year);
//     // Merge both lists
//     const allHolidays = mergeHolidays(apiHolidays, fixedHolidays);
    
//     // Retrieve the "Annual Leave" type from the LeaveType table
//     const annualLeaveType = await LeaveType.findOne({ where: { name: 'Annual Leave' } });
//     if (!annualLeaveType) {
//       throw new Error('Annual Leave type not found in LeaveType table');
//     }
    
//     // Get the user's leave allocation for Annual Leave
//     const allocation = await LeaveAllocation.findOne({
//       where: { userId: user.id, leaveTypeId: annualLeaveType.id }
//     });
//     const remainingDays = allocation ? allocation.currentAllocations : 0;
//     console.log('Remaining leave days:', remainingDays);
    
//     // (Optional) Calculate used leave days from approved leave requests (if needed)
//     const approvedRequests = await LeaveRequest.findAll({
//       where: {
//         userId: user.id,
//         leaveTypeId: annualLeaveType.id,
//         status: 'Approved'
//       },
//     });
//     let usedDays = 0;
//     approvedRequests.forEach(request => {
//       const start = new Date(request.startDate);
//       const end = new Date(request.endDate);
//       usedDays += calculateWorkingDays(start, end);
//     });
//     console.log('Used leave days:', usedDays);
    
//     // Generate leave suggestions based on holidays and available leave balance
//     const suggestions = generateSuggestions(allHolidays, remainingDays);
    
//     // Render the suggestions view (or return as JSON)
//     res.render('leave/suggestions', { suggestions });
//     // For a JSON API response, you might use: res.json({ suggestions });
//   } catch (error) {
//     console.error("Error generating leave suggestions:", error.message);
//     console.error("Stack trace:", error.stack);
//     res.status(500).send("Unable to generate leave suggestions at this time.");
//   }
// };
