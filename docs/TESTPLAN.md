# Account Management System - Test Plan

## Overview
This test plan covers the business logic and functionality of the Account Management System COBOL application. The system manages account balance operations including viewing balance, crediting the account, and debiting the account.

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Display Main Menu | Application is running | 1. Start the application | Menu is displayed with options 1-4 (View Balance, Credit Account, Debit Account, Exit) | | | |
| TC-002 | View Current Balance | Application is running and menu is displayed; initial balance is 1000.00 | 1. Select menu option 1 (View Balance) | Display message "Current balance: 1000.00" and return to main menu | | | |
| TC-003 | Credit Account with Valid Amount | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select menu option 2 (Credit Account) 2. Enter amount: 500.00 | Display message "Amount credited. New balance: 1500.00" and return to menu | | | |
| TC-004 | Credit Account with Zero Amount | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select menu option 2 (Credit Account) 2. Enter amount: 0.00 | Display message "Amount credited. New balance: 1000.00" and return to menu | | | |
| TC-005 | Credit Account Multiple Times | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select option 2, enter 100.00 2. Select option 1 to verify balance is 1100.00 3. Select option 2, enter 200.00 4. Select option 1 to verify balance is 1300.00 | All operations succeed and balance accumulates correctly (1000.00 → 1100.00 → 1300.00) | | | |
| TC-006 | Debit Account with Valid Amount Less Than Balance | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select menu option 3 (Debit Account) 2. Enter amount: 300.00 | Display message "Amount debited. New balance: 700.00" and return to menu | | | |
| TC-007 | Debit Account with Amount Equal to Balance | Application is running; menu is displayed; balance is 1000.00 | 1. Select menu option 3 (Debit Account) 2. Enter amount: 1000.00 | Display message "Amount debited. New balance: 0.00" and return to menu | | | |
| TC-008 | Debit Account with Insufficient Funds | Application is running; menu is displayed; balance is 1000.00 | 1. Select menu option 3 (Debit Account) 2. Enter amount: 1500.00 | Display message "Insufficient funds for this debit." and balance remains 1000.00 | | | |
| TC-009 | Debit Account with Zero Amount | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select menu option 3 (Debit Account) 2. Enter amount: 0.00 | Display message "Amount debited. New balance: 1000.00" and return to menu | | | |
| TC-010 | Debit After Credit Sequence | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select option 2, enter 500.00 to credit (balance = 1500.00) 2. Select option 3, enter 200.00 to debit | Display messages for credit and debit operations; final balance should be 1300.00 | | | |
| TC-011 | Attempted Debit After Insufficient Credit | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select option 3, enter 600.00 (insufficient - should fail, balance stays 1000.00) 2. Select option 1 to verify balance is 1000.00 | First debit fails with insufficient funds message; balance verification shows 1000.00 | | | |
| TC-012 | Invalid Menu Choice - Enter 0 | Application is running; menu is displayed | 1. Enter menu choice: 0 | Display message "Invalid choice, please select 1-4." and return to menu | | | |
| TC-013 | Invalid Menu Choice - Enter 5 | Application is running; menu is displayed | 1. Enter menu choice: 5 | Display message "Invalid choice, please select 1-4." and return to menu | | | |
| TC-014 | Invalid Menu Choice - Enter Negative Number | Application is running; menu is displayed | 1. Enter menu choice: -1 | Display message "Invalid choice, please select 1-4." and return to menu | | | |
| TC-015 | Invalid Menu Choice - Enter Non-Numeric | Application is running; menu is displayed | 1. Enter menu choice: ABC | System handles gracefully (behavior depends on COBOL input handling) | | | |
| TC-016 | Exit Application | Application is running; menu is displayed | 1. Select menu option 4 (Exit) | Display message "Exiting the program. Goodbye!" and program terminates | | | |
| TC-017 | Multiple Menu Cycles Before Exit | Application is running | 1. Select option 1 (View Balance) 2. Return to menu 3. Select option 2, enter 100.00 (Credit) 4. Return to menu 5. Select option 1 (View Balance) 6. Select option 4 (Exit) | All options execute successfully and program exits cleanly after multiple operations | | | |
| TC-018 | Credit Large Amount | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select option 2 (Credit) 2. Enter amount: 999999.99 | Display message showing new balance and return to menu (or handle based on max field size) | | | |
| TC-019 | Debit Account with Small Amount | Application is running; menu is displayed; initial balance is 1000.00 | 1. Select option 3 (Debit) 2. Enter amount: 0.01 | Display message "Amount debited. New balance: 999.99" | | | |
| TC-020 | Data Persistence Check | Application is running; perform multiple operations | 1. Credit 250.00 (balance = 1250.00) 2. Return to menu 3. View balance | Display shows current balance reflecting all previous operations performed in session | | | |

## Notes

- Initial account balance is 1000.00
- All monetary amounts are displayed with 2 decimal places
- The system stores balance in memory during the session
- Invalid menu choices should display error message and re-prompt for input
- All operations should return to the main menu after completion
- The debit operation validates sufficient funds before allowing withdrawal
- Both credit and debit operations update and display the new balance immediately
