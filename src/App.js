import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavigationBar from './components/NavigationBar';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import { customerAPI, transactionAPI } from './services/api';
import './App.css';

// Main App Component (wrapped with AuthProvider)
function AppContent() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load customers from API when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCustomers();
    }
  }, [isAuthenticated]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const customersData = await customerAPI.getAllCustomers();
      setCustomers(customersData);
      
      // Initialize transactions for each customer
      const transactionsData = {};
      customersData.forEach(customer => {
        transactionsData[customer.id] = [];
      });
      setTransactions(transactionsData);
    } catch (err) {
      setError('Failed to load customers. Please check your connection.');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer) => {
    try {
      // Check if customer with this mobile number already exists
      if (customers.find(c => c.mobile === customer.mobile)) {
        alert('A customer with this mobile number already exists!');
        return;
      }
      
      const newCustomer = await customerAPI.createCustomer(customer);
      setCustomers([...customers, newCustomer]);
      setTransactions(prev => ({
        ...prev,
        [newCustomer.id]: []
      }));
    } catch (err) {
      alert('Failed to create customer. Please try again.');
      console.error('Error creating customer:', err);
    }
  };

  const updateCustomer = async (id, updatedCustomer) => {
    try {
      const updatedCustomerData = await customerAPI.updateCustomer(id, updatedCustomer);
      setCustomers(customers.map(customer => 
        customer.id === id ? updatedCustomerData : customer
      ));
    } catch (err) {
      alert('Failed to update customer. Please try again.');
      console.error('Error updating customer:', err);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customerAPI.deleteCustomer(id);
      setCustomers(customers.filter(customer => customer.id !== id));
      const newTransactions = { ...transactions };
      delete newTransactions[id];
      setTransactions(newTransactions);
    } catch (err) {
      alert('Failed to delete customer. Please try again.');
      console.error('Error deleting customer:', err);
    }
  };

  const addTransaction = async (customerId, transaction) => {
    try {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      if (transaction.type === 'Payment') {
        // Use the enhanced processPayment method
        const paymentResult = await transactionAPI.processPayment({
          customerId: customerId,
          customerName: customer.name,
          amount: parseFloat(transaction.amount),
          description: transaction.description || 'Payment received',
          date: transaction.date,
          paymentMethod: transaction.paymentMethod || 'CASH',
          notes: transaction.notes || ''
        });

        // Add transaction to local state
        setTransactions(prev => ({
          ...prev,
          [customerId]: [...(prev[customerId] || []), {
            ...paymentResult.transaction,
            id: paymentResult.transaction.id || Date.now().toString(),
            type: 'Payment',
            status: 'Completed'
          }]
        }));

        // Update customer in local state with new balance
        setCustomers(customers.map(c => 
          c.id === customerId 
            ? { ...c, totalDue: paymentResult.newBalance, lastTransactionDate: transaction.date }
            : c
        ));

      } else {
        // Use the enhanced addCredit method for regular transactions
        const creditResult = await transactionAPI.addCredit({
          customerId: customerId,
          customerName: customer.name,
          amount: parseFloat(transaction.amount),
          description: transaction.description,
          date: transaction.date,
          status: 'PENDING',
          paymentMethod: transaction.paymentMethod || 'CASH',
          notes: transaction.notes || ''
        });

        // Add transaction to local state
        setTransactions(prev => ({
          ...prev,
          [customerId]: [...(prev[customerId] || []), {
            ...creditResult.transaction,
            id: creditResult.transaction.id || Date.now().toString(),
            type: transaction.type,
            status: 'Pending'
          }]
        }));

        // Update customer in local state with new balance
        setCustomers(customers.map(c => 
          c.id === customerId 
            ? { ...c, totalDue: creditResult.newBalance, lastTransactionDate: transaction.date }
            : c
        ));
      }
    } catch (err) {
      alert('Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', err);
    }
  };

  const markAsPaid = async (customerId, transactionId) => {
    try {
      // Mark transaction as completed via API
      await transactionAPI.markTransactionStatus(transactionId, 'COMPLETED');

      // Update local transaction state
      setTransactions(prev => ({
        ...prev,
        [customerId]: prev[customerId].map(transaction =>
          transaction.id === transactionId
            ? { ...transaction, status: 'Paid' }
            : transaction
        )
      }));

      // Get the transaction amount to update customer balance
      const transaction = transactions[customerId]?.find(t => t.id === transactionId);
      if (transaction) {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
          const newTotalDue = Math.max(0, customer.totalDue - parseFloat(transaction.amount));
          
          // Update customer balance via API
          await customerAPI.updateCustomerTotalDue(customerId, newTotalDue);
          
          // Update local customer state
          setCustomers(customers.map(c => 
            c.id === customerId ? { ...c, totalDue: newTotalDue } : c
          ));
        }
      }
    } catch (err) {
      alert('Failed to mark transaction as paid. Please try again.');
      console.error('Error marking transaction as paid:', err);
    }
  };

  // Show authentication page if not authenticated
  if (!isAuthenticated && !authLoading) {
    return <AuthPage />;
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading your data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadCustomers} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main app content for authenticated users
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <main className="main-content">
          <Routes>
            {/* Redirect to dashboard after login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard 
                    customers={customers}
                    transactions={transactions}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <ProtectedRoute>
                  <CustomerList 
                    customers={customers}
                    onAddCustomer={addCustomer}
                    onUpdateCustomer={updateCustomer}
                    onDeleteCustomer={deleteCustomer}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/:id" 
              element={
                <ProtectedRoute>
                  <CustomerDetail 
                    customers={customers}
                    transactions={transactions}
                    onAddTransaction={addTransaction}
                    onMarkAsPaid={markAsPaid}
                    onUpdateCustomer={updateCustomer}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Root App Component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

