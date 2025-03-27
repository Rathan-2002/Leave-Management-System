# Leave Management System

## Overview

The **Leave Management System** is a web application designed to efficiently manage employee leave requests, leave allocations, and approvals. Administrators can create and manage leave types, allocate leave to employees, and approve or reject leave requests. Employees can submit leave requests and view their leave balances, ensuring streamlined leave management within the organization.

## Features

- **Leave Types**: Define and manage various leave types (e.g., sick leave, annual leave).
- **Leave Allocations**: Allocate leave days to employees based on their roles and entitlements.
- **Leave Requests**: Employees can submit leave requests for approval.
- **Leave Approval**: Administrators have the ability to approve or reject leave requests.
- **Leave Balance**: Employees can view their current leave balance.
- **User Management**: Admins can manage employee and administrator accounts.
- **Role-Based Access Control (RBAC)**: Different roles (Admin, Employee) have different access levels to the system.

## Project Structure

The project follows a modular architecture for ease of maintenance and scalability:

- `config`: Configuration files for the application, including database settings and environment variables.
- `controllers`: Business logic for handling different features.
- `middleware`: Authentication and authorization middleware.
- `migrations`: Database schema migration files.
- `models`: Database models that define the structure of tables.
- `public`: Static assets like CSS, JavaScript, and image files.
- `routes`: Defines the API endpoints for the application.
- `seeders`: Files that populate the database with initial data.
- `views`: View files that render the user interface.

## Technical Details

- **Backend**: Node.js, Express.js, Sequelize (ORM), MySQL
- **Frontend**: EJS, Bootstrap, CSS
- **Database**: MySQL

## Installation Instructions

### Prerequisites
- Make sure you have **Node.js** and **MySQL** installed.

### Steps

1. **Clone the Repository**
   Clone the repository to your local machine using the following command:
   ```bash
   git clone https://github.com/your-username/LeaveManagementNode.git
   ```

2. **Install Dependencies**
   Navigate to the project directory and install all the necessary dependencies using npm:
   ```bash
   cd LeaveManagementNode
   npm install
   ```

3. **Create a `.env` File**
   In the root directory of the project, create a `.env` file and add the following environment variables:
   ```bash
   # Replace with the your related data
   DB_NAME=leave_management_data
   DB_USER=user
   DB_PASSWORD=root      
   DB_HOST=localhost
   DB_DIALECT=mysql
   SESSION_SECRET=// your secret key
   CALENDARIFIC_API_KEY=//your API Key
   ```

4. **Set Up the Database**
   - Create a MySQL database with the name specified in your `.env` file (`leave_management_data`).
   - Update the `config/database.js` file with your MySQL credentials (DB_USER, DB_PASSWORD, etc.) from the `.env` file.

5. **Run Database Migrations**
   Run the Sequelize migrations to set up your database schema:
   ```bash
   npx sequelize db:migrate
   ```

6. **Start the Server**
   Start the application:
   ```bash
   npm start
   ```
   The server will now be running locally at `http://localhost:3000`.
