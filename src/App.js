import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    const savedTransactions = localStorage.getItem('transactions');
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addCustomer = (customer) => {
    // Check if customer with this mobile number already exists
    if (customers.find(c => c.mobile === customer.mobile)) {
      alert('A customer with this mobile number already exists!');
      return;
    }
    
    const newCustomer = {
      ...customer,
      id: customer.mobile, // Use mobile number as ID
      totalDue: 0,
      lastTransactionDate: null
    };
    setCustomers([...customers, newCustomer]);
    setTransactions(prev => ({
      ...prev,
      [newCustomer.id]: []
    }));
  };

  const updateCustomer = (id, updatedCustomer) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, ...updatedCustomer } : customer
    ));
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    const newTransactions = { ...transactions };
    delete newTransactions[id];
    setTransactions(newTransactions);
  };

  const addTransaction = (customerId, transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      status: 'Pending'
    };
    
    setTransactions(prev => ({
      ...prev,
      [customerId]: [...(prev[customerId] || []), newTransaction]
    }));

    // Update customer's total due and last transaction date
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const newTotalDue = customer.totalDue + parseFloat(transaction.amount);
      updateCustomer(customerId, {
        totalDue: newTotalDue,
        lastTransactionDate: transaction.date
      });
    }
  };

  const markAsPaid = (customerId, transactionId) => {
    setTransactions(prev => ({
      ...prev,
      [customerId]: prev[customerId].map(transaction =>
        transaction.id === transactionId
          ? { ...transaction, status: 'Paid' }
          : transaction
      )
    }));

    // Update customer's total due
    const transaction = transactions[customerId]?.find(t => t.id === transactionId);
    if (transaction) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        const newTotalDue = Math.max(0, customer.totalDue - parseFloat(transaction.amount));
        updateCustomer(customerId, { totalDue: newTotalDue });
      }
    }
  };

  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/customers" replace />} />
            <Route 
              path="/customers" 
              element={
                <CustomerList 
                  customers={customers}
                  onAddCustomer={addCustomer}
                  onUpdateCustomer={updateCustomer}
                  onDeleteCustomer={deleteCustomer}
                />
              } 
            />
            <Route 
              path="/customer/:id" 
              element={
                <CustomerDetail 
                  customers={customers}
                  transactions={transactions}
                  onAddTransaction={addTransaction}
                  onMarkAsPaid={markAsPaid}
                  onUpdateCustomer={updateCustomer}
                />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  customers={customers}
                  transactions={transactions}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
