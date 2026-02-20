const readline = require('readline');

/**
 * Data Layer - Simulates DataProgram (data.cob)
 * Manages account balance storage and retrieval
 */
class DataStore {
  constructor() {
    this.balance = 1000.00;
  }

  // READ operation - retrieves current balance
  read() {
    return this.balance;
  }

  // WRITE operation - persists new balance
  write(amount) {
    this.balance = Math.round(parseFloat(amount) * 100) / 100;
  }
}

/**
 * Operations Layer - Simulates Operations program (operations.cob)
 * Implements business logic for account operations
 */
class Operations {
  constructor(dataStore) {
    this.dataStore = dataStore;
    this.rl = null;
  }

  setReadlineInterface(rl) {
    this.rl = rl;
  }

  /**
   * TOTAL operation - View current balance
   */
  async viewBalance() {
    const balance = this.dataStore.read();
    console.log(`Current balance: ${balance.toFixed(2)}`);
  }

  /**
   * CREDIT operation - Add funds to account
   */
  async creditAccount() {
    return new Promise((resolve) => {
      this.rl.question('Enter credit amount: ', (input) => {
        const amount = parseFloat(input);
        if (isNaN(amount) || amount < 0) {
          console.log('Invalid amount entered.');
          resolve();
          return;
        }

        const currentBalance = this.dataStore.read();
        const newBalance = currentBalance + amount;
        this.dataStore.write(newBalance);
        console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
        resolve();
      });
    });
  }

  /**
   * DEBIT operation - Withdraw funds from account
   * Validates sufficient funds before allowing withdrawal
   */
  async debitAccount() {
    return new Promise((resolve) => {
      this.rl.question('Enter debit amount: ', (input) => {
        const amount = parseFloat(input);
        if (isNaN(amount) || amount < 0) {
          console.log('Invalid amount entered.');
          resolve();
          return;
        }

        const currentBalance = this.dataStore.read();
        
        // Validate sufficient funds
        if (currentBalance >= amount) {
          const newBalance = currentBalance - amount;
          this.dataStore.write(newBalance);
          console.log(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
        } else {
          console.log('Insufficient funds for this debit.');
        }
        resolve();
      });
    });
  }

  /**
   * Execute the requested operation
   */
  async execute(operationType) {
    switch (operationType) {
      case 'TOTAL':
        await this.viewBalance();
        break;
      case 'CREDIT':
        await this.creditAccount();
        break;
      case 'DEBIT':
        await this.debitAccount();
        break;
      default:
        console.log('Unknown operation.');
    }
  }
}

/**
 * Main Application - Simulates MainProgram (main.cob)
 * Menu-driven interface for user interaction
 */
class AccountManagementSystem {
  constructor() {
    this.dataStore = new DataStore();
    this.operations = new Operations(this.dataStore);
    this.continueFlag = true;
  }

  /**
   * Display the main menu
   */
  displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Main application loop
   */
  async run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.operations.setReadlineInterface(rl);

    const askQuestion = (prompt) => {
      return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
          resolve(answer.trim());
        });
      });
    };

    while (this.continueFlag) {
      this.displayMenu();

      const choice = await askQuestion('Enter your choice (1-4): ');
      const userChoice = parseInt(choice, 10);

      switch (userChoice) {
        case 1:
          await this.operations.execute('TOTAL');
          break;
        case 2:
          await this.operations.execute('CREDIT');
          break;
        case 3:
          await this.operations.execute('DEBIT');
          break;
        case 4:
          this.continueFlag = false;
          break;
        default:
          console.log('Invalid choice, please select 1-4.');
      }
    }

    console.log('Exiting the program. Goodbye!');
    rl.close();
    process.exit(0);
  }
}

// Program entry point
if (require.main === module) {
  const app = new AccountManagementSystem();
  app.run().catch((err) => {
    console.error('An error occurred:', err);
    process.exit(1);
  });
}

// Export for testing
module.exports = { AccountManagementSystem, Operations, DataStore };
