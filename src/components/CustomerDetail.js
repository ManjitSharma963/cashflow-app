import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TransactionModal from './TransactionModal';
import './CustomerDetail.css';

const CustomerDetail = ({ customers, transactions, onAddTransaction, onMarkAsPaid, onUpdateCustomer }) => {
  const { id } = useParams();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const customer = customers.find(c => c.id === id);
  const customerTransactions = transactions[id] || [];

  if (!customer) {
    return (
      <div className="customer-detail">
        <div className="error-state">
          <h2>Customer not found</h2>
          <Link to="/customers" className="primary-btn">
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const handleAddTransaction = () => {
    setIsTransactionModalOpen(true);
  };

  const handleEditCustomer = () => {
    // TODO: Implement edit customer functionality
    alert('Edit customer functionality coming soon!');
  };

  const handleSaveTransaction = (transactionData) => {
    onAddTransaction(id, transactionData);
    setIsTransactionModalOpen(false);
  };

  const handleMarkAsPaid = (transactionId) => {
    onMarkAsPaid(id, transactionId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const pendingTransactions = customerTransactions.filter(t => t.status === 'Pending');
  const paidTransactions = customerTransactions.filter(t => t.status === 'Paid');

  return (
    <div className="customer-detail">
      <div className="customer-detail-header">
        <Link to="/customers" className="back-link">← Back to Customers</Link>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleEditCustomer}>
            Edit Customer
          </button>
          <button className="btn-primary" onClick={handleAddTransaction}>
            + Add Transaction
          </button>
        </div>
      </div>

      <div className="customer-info-card">
        <div className="customer-info-header">
          <h1>{customer.name}</h1>
          <div className={`status-badge ${customer.totalDue > 0 ? 'due' : 'paid'}`}>
            {customer.totalDue > 0 ? 'Has Outstanding' : 'All Paid'}
          </div>
        </div>
        
        <div className="customer-info-grid">
          <div className="info-item">
            <label>Mobile Number</label>
            <span>{customer.mobile}</span>
          </div>
          <div className="info-item">
            <label>Address</label>
            <span>{customer.address || 'No address provided'}</span>
          </div>
          <div className="info-item">
            <label>Total Due</label>
            <span className={`amount ${customer.totalDue > 0 ? 'due' : 'paid'}`}>
              {formatCurrency(customer.totalDue)}
            </span>
          </div>
          <div className="info-item">
            <label>Last Transaction</label>
            <span>{customer.lastTransactionDate ? formatDate(customer.lastTransactionDate) : 'Never'}</span>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h2>Transactions</h2>
          <div className="transaction-stats">
            <span className="stat-item">
              <span className="stat-label">Pending:</span>
              <span className="stat-value pending">{pendingTransactions.length}</span>
            </span>
            <span className="stat-item">
              <span className="stat-label">Paid:</span>
              <span className="stat-value paid">{paidTransactions.length}</span>
            </span>
          </div>
        </div>

        {customerTransactions.length === 0 ? (
          <div className="empty-transactions">
            <div className="empty-icon">📝</div>
            <h3>No transactions yet</h3>
            <p>Start by adding a transaction for this customer</p>
            <button className="primary-btn" onClick={handleAddTransaction}>
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="transactions-list">
            {customerTransactions.map(transaction => (
              <div key={transaction.id} className={`transaction-card ${transaction.status.toLowerCase()}`}>
                <div className="transaction-header">
                  <div className="transaction-date">{formatDate(transaction.date)}</div>
                  <div className={`transaction-status ${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </div>
                </div>
                <div className="transaction-content">
                  <div className="transaction-description">{transaction.description}</div>
                  <div className="transaction-amount">{formatCurrency(transaction.amount)}</div>
                </div>
                {transaction.status === 'Pending' && (
                  <div className="transaction-actions">
                    <button 
                      className="mark-paid-btn"
                      onClick={() => handleMarkAsPaid(transaction.id)}
                    >
                      Mark as Paid
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
};

export default CustomerDetail; 