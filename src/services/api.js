const API_BASE_URL = 'http://localhost:8080/api';

// Customer API endpoints
export const customerAPI = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customerData.name,
          mobile: customerData.mobile,
          address: customerData.address || '',
          category: customerData.category || 'Regular',
          notes: customerData.notes || '',
          totalDue: 0.00,
          isActive: true
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customerData.name,
          mobile: customerData.mobile,
          address: customerData.address || '',
          category: customerData.category || 'Regular',
          notes: customerData.notes || '',
          totalDue: customerData.totalDue || 0.00,
          isActive: customerData.isActive !== undefined ? customerData.isActive : true
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Update customer total due amount
  updateCustomerTotalDue: async (id, totalDue) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalDue: totalDue
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating customer total due:', error);
      throw error;
    }
  },

  // Update customer total due via query parameter endpoint
  updateCustomerTotalDueByQuery: async (id, totalDue) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}/total-due?totalDue=${totalDue}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating customer total due by query:', error);
      throw error;
    }
  },

  // Partial update customer (only update provided fields)
  updateCustomerPartial: async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating customer partial:', error);
      throw error;
    }
  },

  // PATCH method for partial updates
  patchCustomer: async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error patching customer:', error);
      throw error;
    }
  }
};

// Transaction API endpoints
export const transactionAPI = {
  // Get all transactions with optional filters
  getAllTransactions: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.customerId) queryParams.append('customerId', filters.customerId);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      
      const url = `${API_BASE_URL}/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: transactionData.customerId,
          customerName: transactionData.customerName,
          transactionType: transactionData.transactionType,
          amount: transactionData.amount,
          description: transactionData.description,
          date: transactionData.date,
          status: transactionData.status,
          paymentMethod: transactionData.paymentMethod,
          notes: transactionData.notes || ''
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update transaction
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: transactionData.customerId,
          customerName: transactionData.customerName,
          transactionType: transactionData.transactionType,
          amount: transactionData.amount,
          description: transactionData.description,
          date: transactionData.date,
          status: transactionData.status,
          paymentMethod: transactionData.paymentMethod,
          notes: transactionData.notes || ''
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Mark transaction as paid/completed/cancelled
  markTransactionStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}/mark-paid?status=${status}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marking transaction status:', error);
      throw error;
    }
  },

  // Get transactions for a specific customer
  getCustomerTransactions: async (customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/customer/${customerId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer transactions:', error);
      throw error;
    }
  },

  // Get pending transactions
  getPendingTransactions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/pending`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      throw error;
    }
  },

  // Get overdue transactions
  getOverdueTransactions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/overdue`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching overdue transactions:', error);
      throw error;
    }
  },

  // Get daily sales transactions
  getDailySales: async (date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/daily/sales?date=${date}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      throw error;
    }
  },

  // Get daily cash transactions
  getDailyCash: async (date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/daily/cash?date=${date}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching daily cash:', error);
      throw error;
    }
  },

  // Get daily credit transactions
  getDailyCredit: async (date) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/daily/credit?date=${date}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching daily credit:', error);
      throw error;
    }
  },

  // Get period sales transactions
  getPeriodSales: async (startDate, endDate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/period/sales?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching period sales:', error);
      throw error;
    }
  },

  // Get period cash transactions
  getPeriodCash: async (startDate, endDate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/period/cash?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching period cash:', error);
      throw error;
    }
  },

  // Get period credit transactions
  getPeriodCredit: async (startDate, endDate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/period/credit?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching period credit:', error);
      throw error;
    }
  },

  // Legacy method for backward compatibility
  addTransaction: async (customerId, transactionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  // Create transaction with automatic customer total due update
  createTransactionWithCustomerUpdate: async (transactionData) => {
    try {
      // First create the transaction
      const transactionResponse = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: transactionData.customerId,
          customerName: transactionData.customerName,
          transactionType: transactionData.transactionType,
          amount: transactionData.amount,
          description: transactionData.description,
          date: transactionData.date,
          status: transactionData.status,
          paymentMethod: transactionData.paymentMethod,
          notes: transactionData.notes || ''
        }),
      });
      
      if (!transactionResponse.ok) {
        throw new Error(`HTTP error! status: ${transactionResponse.status}`);
      }
      
      const transaction = await transactionResponse.json();
      
      // Calculate new customer total due based on transaction type
      if (transactionData.newCustomerTotalDue !== undefined) {
        try {
          await customerAPI.updateCustomerTotalDue(transactionData.customerId, transactionData.newCustomerTotalDue);
        } catch (customerUpdateError) {
          console.warn('Transaction created but customer total due update failed:', customerUpdateError);
        }
      }
      
      return transaction;
    } catch (error) {
      console.error('Error creating transaction with customer update:', error);
      throw error;
    }
  },

  // Calculate customer balance after transaction
  calculateCustomerBalance: (currentBalance, transactionType, amount) => {
    const numAmount = parseFloat(amount);
    switch (transactionType.toUpperCase()) {
      case 'CREDIT':
        return currentBalance + numAmount; // Customer owes more
      case 'PAYMENT':
        return currentBalance - numAmount; // Customer pays, owes less
      case 'ADJUSTMENT':
        return currentBalance - numAmount; // Usually reduces what customer owes
      default:
        return currentBalance;
    }
  },

  // Update transaction with customer balance recalculation
  updateTransactionWithCustomerUpdate: async (id, transactionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: transactionData.customerId,
          customerName: transactionData.customerName,
          transactionType: transactionData.transactionType,
          amount: transactionData.amount,
          description: transactionData.description,
          date: transactionData.date,
          status: transactionData.status,
          paymentMethod: transactionData.paymentMethod,
          notes: transactionData.notes || ''
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const transaction = await response.json();
      
      // Update customer total due if provided
      if (transactionData.newCustomerTotalDue !== undefined) {
        try {
          await customerAPI.updateCustomerTotalDue(transactionData.customerId, transactionData.newCustomerTotalDue);
        } catch (customerUpdateError) {
          console.warn('Transaction updated but customer total due update failed:', customerUpdateError);
        }
      }
      
      return transaction;
    } catch (error) {
      console.error('Error updating transaction with customer update:', error);
      throw error;
    }
  },

  // Process payment with automatic customer balance update
  processPayment: async (paymentData) => {
    try {
      // Get current customer data
      const customer = await customerAPI.getCustomerById(paymentData.customerId);
      
      // Calculate new balance
      const newBalance = Math.max(0, customer.totalDue - parseFloat(paymentData.amount));
      
      // Create payment transaction
      const transaction = await transactionAPI.createTransaction({
        customerId: paymentData.customerId,
        customerName: paymentData.customerName || customer.name,
        transactionType: 'PAYMENT',
        amount: paymentData.amount,
        description: paymentData.description || 'Payment received',
        date: paymentData.date || new Date().toISOString().split('T')[0],
        status: 'COMPLETED',
        paymentMethod: paymentData.paymentMethod || 'CASH',
        notes: paymentData.notes || ''
      });
      
      // Update customer balance
      await customerAPI.updateCustomerTotalDue(paymentData.customerId, newBalance);
      
      return {
        transaction,
        previousBalance: customer.totalDue,
        newBalance: newBalance,
        amountPaid: parseFloat(paymentData.amount)
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Add credit transaction with customer balance update
  addCredit: async (creditData) => {
    try {
      // Get current customer data
      const customer = await customerAPI.getCustomerById(creditData.customerId);
      
      // Calculate new balance
      const newBalance = customer.totalDue + parseFloat(creditData.amount);
      
      // Create credit transaction
      const transaction = await transactionAPI.createTransaction({
        customerId: creditData.customerId,
        customerName: creditData.customerName || customer.name,
        transactionType: 'CREDIT',
        amount: creditData.amount,
        description: creditData.description,
        date: creditData.date || new Date().toISOString().split('T')[0],
        status: creditData.status || 'PENDING',
        paymentMethod: creditData.paymentMethod || 'CASH',
        notes: creditData.notes || ''
      });
      
      // Update customer balance
      await customerAPI.updateCustomerTotalDue(creditData.customerId, newBalance);
      
      return {
        transaction,
        previousBalance: customer.totalDue,
        newBalance: newBalance,
        creditAmount: parseFloat(creditData.amount)
      };
    } catch (error) {
      console.error('Error adding credit:', error);
      throw error;
    }
  }
};

export default {
  customerAPI,
  transactionAPI
}; 