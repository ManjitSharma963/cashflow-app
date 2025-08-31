import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ customers, transactions }) => {
  const totalCustomers = customers.length;
  
  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.totalDue, 0);
  
  const allTransactions = Object.values(transactions).flat();
  const totalCollected = allTransactions
    .filter(transaction => transaction.status === 'Paid')
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

  const customersWithOutstanding = customers.filter(customer => customer.totalDue > 0).length;
  const customersFullyPaid = customers.filter(customer => customer.totalDue === 0).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getRecentTransactions = () => {
    const allTransactions = Object.values(transactions).flat();
    return allTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const recentTransactions = getRecentTransactions();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your credit management</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Customers</h3>
            <div className="stat-value">{totalCustomers}</div>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                <span className="label">Outstanding:</span>
                <span className="value outstanding">{customersWithOutstanding}</span>
              </span>
              <span className="breakdown-item">
                <span className="label">Fully Paid:</span>
                <span className="value paid">{customersFullyPaid}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Outstanding</h3>
            <div className="stat-value outstanding">{formatCurrency(totalOutstanding)}</div>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                <span className="label">Customers with dues:</span>
                <span className="value">{customersWithOutstanding}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Total Collected</h3>
            <div className="stat-value paid">{formatCurrency(totalCollected)}</div>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                <span className="label">Paid transactions:</span>
                <span className="value">{allTransactions.filter(t => t.status === 'Paid').length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/customers" className="quick-action-btn">
              <span className="action-icon">➕</span>
              <span>Add New Customer</span>
            </Link>
            <Link to="/customers" className="quick-action-btn">
              <span className="action-icon">👥</span>
              <span>View All Customers</span>
            </Link>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/customers" className="view-all-link">View All</Link>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="empty-recent">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="recent-transactions">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="recent-transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-description">{transaction.description}</div>
                    <div className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.status.toLowerCase()}`}>
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 