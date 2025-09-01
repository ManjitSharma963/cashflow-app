import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ customers, transactions }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const totalCustomers = customers.length;
  const totalOutstanding = customers.reduce((sum, customer) => sum + customer.totalDue, 0);
  
  const allTransactions = Object.values(transactions).flat();
  const totalCollected = allTransactions
    .filter(transaction => transaction.status === 'Paid')
    .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

  const customersWithOutstanding = customers.filter(customer => customer.totalDue > 0).length;
  const customersFullyPaid = customers.filter(customer => customer.totalDue === 0).length;

  // Category breakdown
  const categoryBreakdown = customers.reduce((acc, customer) => {
    const category = customer.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Recent activity
  const recentTransactions = allTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Top customers by outstanding amount
  const topOutstandingCustomers = customers
    .filter(c => c.totalDue > 0)
    .sort((a, b) => b.totalDue - a.totalDue)
    .slice(0, 5);

  // Monthly trends (simplified) - for future use
  // const getMonthlyData = () => {
  //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   const currentMonth = new Date().getMonth();
  //   return months.slice(currentMonth - 5, currentMonth + 1);
  // };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your credit management</p>
        <div className="period-selector">
          <button 
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </button>
        </div>
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

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Collection Rate</h3>
            <div className="stat-value">
              {totalOutstanding + totalCollected > 0 
                ? Math.round((totalCollected / (totalOutstanding + totalCollected)) * 100)
                : 0}%
            </div>
            <div className="stat-breakdown">
              <span className="breakdown-item">
                <span className="label">This {selectedPeriod}:</span>
                <span className="value">Active</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card wide">
          <div className="section-header">
            <h2>Customer Categories</h2>
            <span className="section-subtitle">Distribution by customer type</span>
          </div>
          <div className="category-chart">
            {Object.entries(categoryBreakdown).map(([category, count]) => (
              <div key={category} className="category-bar">
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count}</span>
                </div>
                <div className="category-progress">
                  <div 
                    className="category-fill" 
                    style={{ width: `${(count / totalCustomers) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            <Link to="/customers" className="quick-action-btn">
              <span className="action-icon">💰</span>
              <span>Outstanding Dues</span>
            </Link>
            <Link to="/customers" className="quick-action-btn">
              <span className="action-icon">📊</span>
              <span>Generate Report</span>
            </Link>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h2>Top Outstanding</h2>
            <Link to="/customers" className="view-all-link">View All</Link>
          </div>
          {topOutstandingCustomers.length === 0 ? (
            <div className="empty-recent">
              <p>No outstanding customers</p>
            </div>
          ) : (
            <div className="top-customers-list">
              {topOutstandingCustomers.map(customer => (
                <div key={customer.id} className="top-customer-item">
                  <div className="customer-info">
                    <div className="customer-name">{customer.name}</div>
                    <div className="customer-mobile">{customer.mobile}</div>
                  </div>
                  <div className="customer-amount outstanding">
                    {formatCurrency(customer.totalDue)}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                      {formatDate(transaction.date)}
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

      <div className="dashboard-footer">
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="footer-label">Last Updated:</span>
            <span className="footer-value">{new Date().toLocaleString()}</span>
          </div>
          <div className="footer-stat">
            <span className="footer-label">Total Transactions:</span>
            <span className="footer-value">{allTransactions.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 