import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CustomerModal from './CustomerModal';
import './CustomerList.css';

const CustomerList = ({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Handle URL search parameter
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      onDeleteCustomer(id);
    }
  };

  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      onUpdateCustomer(editingCustomer.id, customerData);
    } else {
      onAddCustomer(customerData);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Get unique categories from customers
  const categories = [...new Set(customers.map(c => c.category).filter(Boolean))];

  // Filter and sort customers
  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.mobile.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'due' && customer.totalDue > 0) ||
                           (filterStatus === 'paid' && customer.totalDue === 0);
      const matchesCategory = filterCategory === 'all' || customer.category === filterCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'mobile':
          aValue = a.mobile;
          bValue = b.mobile;
          break;
        case 'totalDue':
          aValue = a.totalDue;
          bValue = b.totalDue;
          break;
        case 'lastTransactionDate':
          aValue = new Date(a.lastTransactionDate || 0);
          bValue = new Date(b.lastTransactionDate || 0);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterCategory('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <div className="customer-list">
      <div className="customer-list-header">
        <h1>Customer List</h1>
        <div className="header-actions">
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button className="add-customer-btn" onClick={handleAddCustomer}>
            + Add Customer
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="advanced-filters">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by name or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label>Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Customers</option>
                <option value="due">Has Outstanding</option>
                <option value="paid">Fully Paid</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Category</label>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Name</option>
                <option value="mobile">Mobile</option>
                <option value="totalDue">Total Due</option>
                <option value="lastTransactionDate">Last Transaction</option>
              </select>
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
            <div className="sort-order-toggle">
              <button 
                className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}
                onClick={() => setSortOrder('asc')}
              >
                ↑ Ascending
              </button>
              <button 
                className={`sort-btn ${sortOrder === 'desc' ? 'active' : ''}`}
                onClick={() => setSortOrder('desc')}
              >
                ↓ Descending
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <div className="summary-stats">
          <span className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{customers.length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Showing:</span>
            <span className="stat-value">{filteredAndSortedCustomers.length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Outstanding:</span>
            <span className="stat-value due">
              {customers.filter(c => c.totalDue > 0).length}
            </span>
          </span>
        </div>
        
        {(searchTerm || filterStatus !== 'all' || filterCategory !== 'all') && (
          <div className="active-filters">
            <span className="filter-tag">
              Active filters: {[
                searchTerm && 'Search',
                filterStatus !== 'all' && filterStatus,
                filterCategory !== 'all' && filterCategory
              ].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No customers yet</h3>
          <p>Start by adding your first customer</p>
          <button className="primary-btn" onClick={handleAddCustomer}>
            Add Customer
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')} className="sortable-header">
                  Customer Name {getSortIcon('name')}
                </th>
                <th onClick={() => toggleSort('mobile')} className="sortable-header">
                  Mobile Number {getSortIcon('mobile')}
                </th>
                <th onClick={() => toggleSort('totalDue')} className="sortable-header">
                  Total Due Amount {getSortIcon('totalDue')}
                </th>
                <th onClick={() => toggleSort('lastTransactionDate')} className="sortable-header">
                  Last Transaction Date {getSortIcon('lastTransactionDate')}
                </th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <Link to={`/customer/${customer.id}`} className="customer-name-link">
                      {customer.name}
                    </Link>
                  </td>
                  <td>{customer.mobile}</td>
                  <td className={`amount ${customer.totalDue > 0 ? 'due' : 'paid'}`}>
                    {formatCurrency(customer.totalDue)}
                  </td>
                  <td>{formatDate(customer.lastTransactionDate)}</td>
                  <td>
                    <span className={`category-badge ${customer.category ? customer.category.toLowerCase() : 'none'}`}>
                      {customer.category || 'None'}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditCustomer(customer)}
                      title="Edit Customer"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteCustomer(customer.id)}
                      title="Delete Customer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
      />
    </div>
  );
};

export default CustomerList; 