// Test script for the updated API endpoints
// Run this with Node.js to test your API

const API_BASE_URL = 'http://localhost:8080/api';

// Test data
const testCustomer = {
  name: "Test Customer",
  mobile: "9876543210",
  address: "123 Test Street",
  category: "Regular",
  notes: "Test customer for API testing"
};

const testTransaction = {
  customerId: "CUST001",
  customerName: "Test Customer",
  transactionType: "CREDIT",
  amount: 150.00,
  description: "Test transaction",
  date: "2024-01-15",
  status: "PENDING",
  paymentMethod: "CASH",
  notes: "Test transaction for API testing"
};

// Utility function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 'ERROR', data: error.message };
  }
}

// Test functions
async function testCustomerAPI() {
  console.log('\n=== Testing Customer API ===');
  
  // Create customer
  console.log('Creating customer...');
  const createResult = await makeRequest(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testCustomer)
  });
  console.log('Create customer:', createResult);
  
  if (createResult.status === 201 && createResult.data.id) {
    const customerId = createResult.data.id;
    
    // Get customer by ID
    console.log('\nGetting customer by ID...');
    const getResult = await makeRequest(`${API_BASE_URL}/customers/${customerId}`);
    console.log('Get customer:', getResult);
    
    // Update customer
    console.log('\nUpdating customer...');
    const updateResult = await makeRequest(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...testCustomer, name: "Updated Test Customer" })
    });
    console.log('Update customer:', updateResult);
    
    // Test partial update - only total due
    console.log('\nTesting partial update (total due only)...');
    const partialUpdateResult = await makeRequest(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalDue: 150.00 })
    });
    console.log('Partial update (PUT):', partialUpdateResult);
    
    // Test PATCH method
    console.log('\nTesting PATCH method...');
    const patchResult = await makeRequest(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalDue: 200.00, notes: 'Updated via PATCH' })
    });
    console.log('PATCH update:', patchResult);
    
    // Test total due update via query parameter
    console.log('\nTesting total due update via query parameter...');
    const queryUpdateResult = await makeRequest(`${API_BASE_URL}/customers/${customerId}/total-due?totalDue=250.00`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Query parameter update:', queryUpdateResult);
    
    // Delete customer
    console.log('\nDeleting customer...');
    const deleteResult = await makeRequest(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE'
    });
    console.log('Delete customer:', deleteResult);
  }
  
  // Get all customers
  console.log('\nGetting all customers...');
  const getAllResult = await makeRequest(`${API_BASE_URL}/customers`);
  console.log('Get all customers:', getAllResult);
}

async function testTransactionAPI() {
  console.log('\n=== Testing Transaction API ===');
  
  // Create transaction
  console.log('Creating transaction...');
  const createResult = await makeRequest(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testTransaction)
  });
  console.log('Create transaction:', createResult);
  
  if (createResult.status === 201 && createResult.data.id) {
    const transactionId = createResult.data.id;
    
    // Get transaction by ID
    console.log('\nGetting transaction by ID...');
    const getResult = await makeRequest(`${API_BASE_URL}/transactions/${transactionId}`);
    console.log('Get transaction:', getResult);
    
    // Update transaction
    console.log('\nUpdating transaction...');
    const updateResult = await makeRequest(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...testTransaction, amount: 175.00, description: "Updated test transaction" })
    });
    console.log('Update transaction:', updateResult);
    
    // Mark transaction as completed
    console.log('\nMarking transaction as completed...');
    const markCompletedResult = await makeRequest(`${API_BASE_URL}/transactions/${transactionId}/mark-paid?status=COMPLETED`, {
      method: 'POST'
    });
    console.log('Mark completed:', markCompletedResult);
    
    // Mark transaction as cancelled
    console.log('\nMarking transaction as cancelled...');
    const markCancelledResult = await makeRequest(`${API_BASE_URL}/transactions/${transactionId}/mark-paid?status=CANCELLED`, {
      method: 'POST'
    });
    console.log('Mark cancelled:', markCancelledResult);
    
    // Delete transaction
    console.log('\nDeleting transaction...');
    const deleteResult = await makeRequest(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'DELETE'
    });
    console.log('Delete transaction:', deleteResult);
  }
  
  // Test all transaction endpoints
  console.log('\n=== Testing Transaction Query Endpoints ===');
  
  // Get all transactions
  console.log('Getting all transactions...');
  const getAllResult = await makeRequest(`${API_BASE_URL}/transactions`);
  console.log('Get all transactions:', getAllResult);
  
  // Get transactions with filters
  console.log('\nGetting transactions with customer ID filter...');
  const filteredResult = await makeRequest(`${API_BASE_URL}/transactions?customerId=CUST001`);
  console.log('Filtered transactions:', filteredResult);
  
  // Get transactions by type
  console.log('\nGetting CREDIT transactions...');
  const creditResult = await makeRequest(`${API_BASE_URL}/transactions?type=CREDIT`);
  console.log('CREDIT transactions:', creditResult);
  
  console.log('\nGetting PAYMENT transactions...');
  const paymentResult = await makeRequest(`${API_BASE_URL}/transactions?type=PAYMENT`);
  console.log('PAYMENT transactions:', paymentResult);
  
  // Get transactions by status
  console.log('\nGetting PENDING transactions...');
  const pendingResult = await makeRequest(`${API_BASE_URL}/transactions?status=PENDING`);
  console.log('PENDING transactions:', pendingResult);
  
  console.log('\nGetting COMPLETED transactions...');
  const completedResult = await makeRequest(`${API_BASE_URL}/transactions?status=COMPLETED`);
  console.log('COMPLETED transactions:', completedResult);
  
  // Get transactions by date range
  console.log('\nGetting transactions by date range...');
  const dateRangeResult = await makeRequest(`${API_BASE_URL}/transactions?startDate=2024-01-01&endDate=2024-01-31`);
  console.log('Date range transactions:', dateRangeResult);
  
  // Get customer transactions
  console.log('\nGetting customer transactions...');
  const customerTransactionsResult = await makeRequest(`${API_BASE_URL}/transactions/customer/CUST001`);
  console.log('Customer transactions:', customerTransactionsResult);
  
  // Get pending transactions
  console.log('\nGetting pending transactions...');
  const pendingTransactionsResult = await makeRequest(`${API_BASE_URL}/transactions/pending`);
  console.log('Pending transactions:', pendingTransactionsResult);
  
  // Get overdue transactions
  console.log('\nGetting overdue transactions...');
  const overdueTransactionsResult = await makeRequest(`${API_BASE_URL}/transactions/overdue`);
  console.log('Overdue transactions:', overdueTransactionsResult);
  
  // Test daily reports
  console.log('\n=== Testing Daily Reports ===');
  
  console.log('Getting daily sales...');
  const dailySalesResult = await makeRequest(`${API_BASE_URL}/transactions/daily/sales?date=2024-01-15`);
  console.log('Daily sales:', dailySalesResult);
  
  console.log('Getting daily cash...');
  const dailyCashResult = await makeRequest(`${API_BASE_URL}/transactions/daily/cash?date=2024-01-15`);
  console.log('Daily cash:', dailyCashResult);
  
  console.log('Getting daily credit...');
  const dailyCreditResult = await makeRequest(`${API_BASE_URL}/transactions/daily/credit?date=2024-01-15`);
  console.log('Daily credit:', dailyCreditResult);
  
  // Test period reports
  console.log('\n=== Testing Period Reports ===');
  
  console.log('Getting period sales...');
  const periodSalesResult = await makeRequest(`${API_BASE_URL}/transactions/period/sales?startDate=2024-01-01&endDate=2024-01-31`);
  console.log('Period sales:', periodSalesResult);
  
  console.log('Getting period cash...');
  const periodCashResult = await makeRequest(`${API_BASE_URL}/transactions/period/cash?startDate=2024-01-01&endDate=2024-01-31`);
  console.log('Period cash:', periodCashResult);
  
  console.log('Getting period credit...');
  const periodCreditResult = await makeRequest(`${API_BASE_URL}/transactions/period/credit?startDate=2024-01-01&endDate=2024-01-31`);
  console.log('Period credit:', periodCreditResult);
}

// Test different transaction types
async function testTransactionTypes() {
  console.log('\n=== Testing Different Transaction Types ===');
  
  const transactionTypes = [
    {
      customerId: "CUST001",
      customerName: "Test Customer",
      transactionType: "CREDIT",
      amount: 150.00,
      description: "Grocery items",
      date: "2024-01-15",
      status: "PENDING",
      paymentMethod: "CASH",
      notes: "Customer will pay later"
    },
    {
      customerId: "CUST001",
      customerName: "Test Customer",
      transactionType: "PAYMENT",
      amount: 100.00,
      description: "Payment received",
      date: "2024-01-15",
      status: "COMPLETED",
      paymentMethod: "CASH",
      notes: "Payment received"
    },
    {
      customerId: "CUST001",
      customerName: "Test Customer",
      transactionType: "ADJUSTMENT",
      amount: 25.00,
      description: "Discount applied",
      date: "2024-01-15",
      status: "COMPLETED",
      paymentMethod: "ADJUSTMENT",
      notes: "Loyalty discount"
    }
  ];
  
  for (let i = 0; i < transactionTypes.length; i++) {
    const transaction = transactionTypes[i];
    console.log(`\nCreating ${transaction.transactionType} transaction...`);
    
    const createResult = await makeRequest(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    console.log(`Create ${transaction.transactionType}:`, createResult);
    
    // Clean up - delete the transaction
    if (createResult.status === 201 && createResult.data.id) {
      await makeRequest(`${API_BASE_URL}/transactions/${createResult.data.id}`, {
        method: 'DELETE'
      });
    }
  }
}

// Test enhanced transaction methods with customer balance updates
async function testEnhancedTransactionMethods() {
  console.log('\n=== Testing Enhanced Transaction Methods ===');
  
  // First create a test customer
  console.log('Creating test customer for enhanced transaction tests...');
  const customerData = {
    name: "Enhanced Test Customer",
    mobile: "9876543210",
    address: "123 Enhanced Test Street",
    category: "Regular",
    notes: "Customer for enhanced transaction testing",
    totalDue: 0.00,
    isActive: true
  };
  
  const createCustomerResult = await makeRequest(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData)
  });
  
  if (createCustomerResult.status === 201 && createCustomerResult.data.id) {
    const customerId = createCustomerResult.data.id;
    console.log('Test customer created:', createCustomerResult.data);
    
    // Test 1: Add credit transaction (should increase customer balance)
    console.log('\nTesting add credit with balance update...');
    const creditData = {
      customerId: customerId,
      customerName: "Enhanced Test Customer",
      transactionType: "CREDIT",
      amount: 150.00,
      description: "Test credit transaction",
      date: "2024-01-15",
      status: "PENDING",
      paymentMethod: "CASH",
      notes: "Test credit for enhanced transaction"
    };
    
    const creditResult = await makeRequest(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creditData)
    });
    console.log('Credit transaction created:', creditResult);
    
    // Check customer balance after credit
    const customerAfterCredit = await makeRequest(`${API_BASE_URL}/customers/${customerId}`);
    console.log('Customer balance after credit:', customerAfterCredit.data?.totalDue);
    
    // Test 2: Process payment (should decrease customer balance)
    console.log('\nTesting payment with balance update...');
    const paymentData = {
      customerId: customerId,
      customerName: "Enhanced Test Customer",
      transactionType: "PAYMENT",
      amount: 50.00,
      description: "Test payment transaction",
      date: "2024-01-15",
      status: "COMPLETED",
      paymentMethod: "CASH",
      notes: "Test payment for enhanced transaction"
    };
    
    const paymentResult = await makeRequest(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    console.log('Payment transaction created:', paymentResult);
    
    // Check customer balance after payment
    const customerAfterPayment = await makeRequest(`${API_BASE_URL}/customers/${customerId}`);
    console.log('Customer balance after payment:', customerAfterPayment.data?.totalDue);
    
    // Test 3: Add adjustment (should decrease customer balance)
    console.log('\nTesting adjustment with balance update...');
    const adjustmentData = {
      customerId: customerId,
      customerName: "Enhanced Test Customer",
      transactionType: "ADJUSTMENT",
      amount: 25.00,
      description: "Test adjustment transaction",
      date: "2024-01-15",
      status: "COMPLETED",
      paymentMethod: "ADJUSTMENT",
      notes: "Test adjustment for enhanced transaction"
    };
    
    const adjustmentResult = await makeRequest(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adjustmentData)
    });
    console.log('Adjustment transaction created:', adjustmentResult);
    
    // Check final customer balance
    const customerFinal = await makeRequest(`${API_BASE_URL}/customers/${customerId}`);
    console.log('Final customer balance:', customerFinal.data?.totalDue);
    
    // Test 4: Test customer total due update methods
    console.log('\nTesting various customer total due update methods...');
    
    // Method 1: PATCH update
    console.log('Testing PATCH total due update...');
    const patchTotalDue = await makeRequest(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalDue: 300.00 })
    });
    console.log('PATCH total due result:', patchTotalDue);
    
    // Method 2: Query parameter update
    console.log('Testing query parameter total due update...');
    const queryTotalDue = await makeRequest(`${API_BASE_URL}/customers/${customerId}/total-due?totalDue=400.00`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Query parameter total due result:', queryTotalDue);
    
    // Method 3: Partial PUT update
    console.log('Testing partial PUT total due update...');
    const partialPutTotalDue = await makeRequest(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalDue: 500.00, notes: 'Updated via partial PUT' })
    });
    console.log('Partial PUT total due result:', partialPutTotalDue);
    
    // Clean up - delete test transactions and customer
    console.log('\nCleaning up test data...');
    
    // Get all transactions for this customer and delete them
    const customerTransactions = await makeRequest(`${API_BASE_URL}/transactions/customer/${customerId}`);
    if (customerTransactions.data && Array.isArray(customerTransactions.data)) {
      for (const transaction of customerTransactions.data) {
        await makeRequest(`${API_BASE_URL}/transactions/${transaction.id}`, {
          method: 'DELETE'
        });
      }
    }
    
    // Delete test customer
    await makeRequest(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE'
    });
    
    console.log('Enhanced transaction test cleanup completed');
  } else {
    console.log('Failed to create test customer for enhanced transaction tests');
  }
}

// Main test function
async function runTests() {
  console.log('Starting API tests...');
  console.log('Make sure your backend server is running on localhost:8080');
  
  try {
    await testCustomerAPI();
    await testTransactionAPI();
    await testTransactionTypes();
    await testEnhancedTransactionMethods(); // Add this line to run the new test
    
    console.log('\n=== All tests completed ===');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testCustomerAPI,
  testTransactionAPI,
  testTransactionTypes,
  testEnhancedTransactionMethods // Add this line to export the new test function
}; 