import React, { useState } from 'react';
import './TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'Credit',
    paymentMethod: 'CASH',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount.trim()) {
      alert('Description and Amount are required!');
      return;
    }

    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount!');
      return;
    }

    // Pass the enhanced form data to parent
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
      type: 'Credit',
      paymentMethod: 'CASH',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Transaction</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Transaction Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="Credit">Credit (Customer owes)</option>
                <option value="Payment">Payment (Customer pays)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Item/Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter item or description"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                step="0.01"
                min="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CARD">Card</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes about this transaction"
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal; 