# Account Management System - Node.js Version

This is a modernized Node.js version of the legacy COBOL Account Management System application.

## Project Structure

```
src/accounting/
├── index.js           # Main application code with DataStore, Operations, and AccountManagementSystem classes
├── package.json       # Node.js project configuration
└── node_modules/      # Installed dependencies
```

## Architecture

The Node.js application mirrors the original COBOL architecture with three main components:

### 1. DataStore (equivalent to data.cob)
- Manages account balance storage and retrieval
- `read()`: Retrieves current balance
- `write(amount)`: Persists new balance

### 2. Operations (equivalent to operations.cob)
- Implements business logic for account operations
- `viewBalance()`: Display current balance (TOTAL operation)
- `creditAccount()`: Add funds to account (CREDIT operation)
- `debitAccount()`: Withdraw funds with validation (DEBIT operation)

### 3. AccountManagementSystem (equivalent to main.cob)
- Menu-driven interface for user interaction
- Validates user input
- Controls application flow

## Features

- ✅ View current account balance (initial balance: $1,000.00)
- ✅ Credit (deposit) funds to the account
- ✅ Debit (withdraw) funds with overdraft protection
- ✅ Insufficient funds validation
- ✅ Menu-driven user interface
- ✅ Exit application gracefully

## Running the Application

### In VS Code (Recommended)
1. Open the VS Code Run and Debug sidebar (Ctrl+Shift+D)
2. Select "Launch Account Management System" from the dropdown
3. Click the play button or press F5

### From Terminal
```bash
cd src/accounting
npm start
```

Or directly:
```bash
node index.js
```

## Running Tests

```bash
npm test
```

## Business Logic Preservation

All original COBOL business logic has been preserved:
- Initial account balance: 1,000.00
- Credit operations: Add amount to current balance
- Debit operations: Subtract amount only if sufficient funds exist
- Data integrity: Balance persists across operations during session
- User input validation: Only accepts valid menu choices (1-4)
- Error handling: Displays appropriate messages for invalid operations

## Test Plan

See [docs/TESTPLAN.md](../../docs/TESTPLAN.md) for comprehensive test coverage that this application fulfills.
