import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CustomerModal from './CustomerModal';
import './CustomerList.css';

const CustomerList = ({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();

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

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm)
  );

  return (
    <div className="customer-list">
      <div className="customer-list-header">
        <h1>Customer List</h1>
        <button className="add-customer-btn" onClick={handleAddCustomer}>
          + Add Customer
        </button>
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
        <>
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search by name or mobile number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            {searchTerm && (
              <div className="search-results-info">
                Showing {filteredCustomers.length} of {customers.length} customers
              </div>
            )}
          </div>

          <div className="table-container">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Total Due Amount</th>
                  <th>Last Transaction Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
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
        </>
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