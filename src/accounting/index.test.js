const { DataStore, Operations, AccountManagementSystem } = require('./index.js');

describe('Account Management System - Unit Tests', () => {
  describe('DataStore', () => {
    let dataStore;

    beforeEach(() => {
      dataStore = new DataStore();
    });

    test('should initialize balance to 1000.00', () => {
      expect(dataStore.read()).toBe(1000.00);
    });

    test('should read current balance', () => {
      const balance = dataStore.read();
      expect(balance).toBe(1000.00);
    });

    test('should write new balance', () => {
      dataStore.write(1500.00);
      expect(dataStore.read()).toBe(1500.00);
    });

    test('should handle decimal amounts correctly', () => {
      dataStore.write(1234.56);
      expect(dataStore.read()).toBe(1234.56);
    });

    test('should round balance to two decimal places', () => {
      dataStore.write(1000.005);
      expect(dataStore.read()).toBe(1000.01);
    });

    test('should handle zero balance', () => {
      dataStore.write(0);
      expect(dataStore.read()).toBe(0);
    });
  });

  describe('Operations - View Balance', () => {
    let dataStore;
    let operations;
    let mockRl;
    let consoleSpy;

    beforeEach(() => {
      dataStore = new DataStore();
      operations = new Operations(dataStore);
      mockRl = { question: jest.fn() };
      operations.setReadlineInterface(mockRl);
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should display initial balance of 1000.00', async () => {
      await operations.viewBalance();
      expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1000.00');
    });

    test('should display correct balance after credit', async () => {
      dataStore.write(1500.00);
      await operations.viewBalance();
      expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1500.00');
    });
  });

  describe('Operations - Credit Account', () => {
    let dataStore;
    let operations;
    let mockRl;
    let consoleSpy;

    beforeEach(() => {
      dataStore = new DataStore();
      operations = new Operations(dataStore);
      mockRl = { question: jest.fn() };
      operations.setReadlineInterface(mockRl);
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should credit valid amount', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('500.00');
      });
      await operations.creditAccount();
      expect(dataStore.read()).toBe(1500.00);
      expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
    });

    test('should credit zero amount', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('0.00');
      });
      await operations.creditAccount();
      expect(dataStore.read()).toBe(1000.00);
      expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1000.00');
    });

    test('should credit large amount', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('999999.99');
      });
      await operations.creditAccount();
      expect(dataStore.read()).toBe(1000999.99);
    });

    test('should handle invalid amount (non-numeric)', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('abc');
      });
      await operations.creditAccount();
      expect(consoleSpy).toHaveBeenCalledWith('Invalid amount entered.');
      expect(dataStore.read()).toBe(1000.00); // Balance unchanged
    });

    test('should handle negative amount', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('-100');
      });
      await operations.creditAccount();
      expect(consoleSpy).toHaveBeenCalledWith('Invalid amount entered.');
      expect(dataStore.read()).toBe(1000.00);
    });
  });

  describe('Operations - Debit Account', () => {
    let dataStore;
    let operations;
    let mockRl;
    let consoleSpy;

    beforeEach(() => {
      dataStore = new DataStore();
      operations = new Operations(dataStore);
      mockRl = { question: jest.fn() };
      operations.setReadlineInterface(mockRl);
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should debit valid amount less than balance', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('300.00');
      });
      await operations.debitAccount();
      expect(dataStore.read()).toBe(700.00);
      expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 700.00');
    });

    test('should debit amount equal to balance', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('1000.00');
      });
      await operations.debitAccount();
      expect(dataStore.read()).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 0.00');
    });

    test('should reject debit with insufficient funds', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('1500.00');
      });
      await operations.debitAccount();
      expect(dataStore.read()).toBe(1000.00); // Balance unchanged
      expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    });

    test('should debit zero amount', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('0.00');
      });
      await operations.debitAccount();
      expect(dataStore.read()).toBe(1000.00);
      expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 1000.00');
    });

    test('should debit small amount', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('0.01');
      });
      await operations.debitAccount();
      expect(dataStore.read()).toBe(999.99);
    });

    test('should handle invalid amount (non-numeric)', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('xyz');
      });
      await operations.debitAccount();
      expect(consoleSpy).toHaveBeenCalledWith('Invalid amount entered.');
      expect(dataStore.read()).toBe(1000.00);
    });

    test('should handle negative amount', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('-100');
      });
      await operations.debitAccount();
      expect(consoleSpy).toHaveBeenCalledWith('Invalid amount entered.');
      expect(dataStore.read()).toBe(1000.00);
    });
  });

  describe('Operations - Execute', () => {
    let dataStore;
    let operations;
    let mockRl;
    let consoleSpy;

    beforeEach(() => {
      dataStore = new DataStore();
      operations = new Operations(dataStore);
      mockRl = { question: jest.fn() };
      operations.setReadlineInterface(mockRl);
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should execute TOTAL operation', async () => {
      await operations.execute('TOTAL');
      expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1000.00');
    });

    test('should execute CREDIT operation', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('500');
      });
      await operations.execute('CREDIT');
      expect(dataStore.read()).toBe(1500.00);
    });

    test('should execute DEBIT operation', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('200');
      });
      await operations.execute('DEBIT');
      expect(dataStore.read()).toBe(800.00);
    });

    test('should handle unknown operation', async () => {
      await operations.execute('UNKNOWN');
      expect(consoleSpy).toHaveBeenCalledWith('Unknown operation.');
    });
  });

  describe('Sequences and Data Integrity', () => {
    let dataStore;
    let operations;
    let mockRl;
    let consoleSpy;

    beforeEach(() => {
      dataStore = new DataStore();
      operations = new Operations(dataStore);
      mockRl = { question: jest.fn() };
      operations.setReadlineInterface(mockRl);
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should accumulate multiple credits', async () => {
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('100');
      });
      await operations.creditAccount();
      expect(dataStore.read()).toBe(1100.00);

      mockRl.question.mockImplementation((prompt, callback) => {
        callback('200');
      });
      await operations.creditAccount();
      expect(dataStore.read()).toBe(1300.00);
    });

    test('should handle debit after credit sequence', async () => {
      // Credit 500
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('500');
      });
      await operations.creditAccount();
      expect(dataStore.read()).toBe(1500.00);

      // Debit 200
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('200');
      });
      await operations.debitAccount();
      expect(dataStore.read()).toBe(1300.00);
    });

    test('should reject debit after insufficient credit', async () => {
      // Try to debit 1500 (insufficient - balance is only 1000)
      mockRl.question.mockClear();
      mockRl.question.mockImplementation((prompt, callback) => {
        callback('1500');
      });
      await operations.debitAccount();
      expect(dataStore.read()).toBe(1000.00); // Should not change

      // Verify balance is correct for next operation
      mockRl.question.mockClear();
      consoleSpy.mockClear();
      await operations.viewBalance();
      expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1000.00');
    });
  });
});
