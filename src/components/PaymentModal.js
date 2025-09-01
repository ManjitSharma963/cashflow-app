import React, { useState, useEffect } from 'react';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onSave, customer, transactions }) => {
  const [paymentData, setPaymentData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    paymentMethod: 'Cash',
    notes: ''
  });

  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [paymentType, setPaymentType] = useState('partial'); // 'partial' or 'lump'

  useEffect(() => {
    if (isOpen && customer) {
      setPaymentData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        paymentMethod: 'Cash',
        notes: ''
      });
      setSelectedTransactions([]);
      setPaymentType('partial');
    }
  }, [isOpen, customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTransactionSelect = (transactionId, checked) => {
    if (checked) {
      setSelectedTransactions(prev => [...prev, transactionId]);
    } else {
      setSelectedTransactions(prev => prev.filter(id => id !== transactionId));
    }
  };

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    setSelectedTransactions([]);
    if (type === 'lump') {
      setPaymentData(prev => ({ ...prev, amount: customer.totalDue.toString() }));
    } else {
      setPaymentData(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!paymentData.amount.trim()) {
      alert('Payment amount is required!');
      return;
    }

    const paymentAmount = parseFloat(paymentData.amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('Please enter a valid amount!');
      return;
    }

    if (paymentAmount > customer.totalDue) {
      alert('Payment amount cannot exceed total outstanding amount!');
      return;
    }

    onSave({
      ...paymentData,
      amount: paymentAmount,
      selectedTransactions,
      paymentType,
      remainingAmount: customer.totalDue - paymentAmount
    });
  };

  if (!isOpen || !customer) return null;

  const pendingTransactions = transactions.filter(t => t.status === 'Pending');
  const totalPending = pendingTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Make Payment</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="payment-summary">
          <div className="customer-info">
            <h3>{customer.name}</h3>
            <p className="customer-mobile">{customer.mobile}</p>
          </div>
          <div className="amount-info">
            <div className="total-outstanding">
              <span className="label">Total Outstanding:</span>
              <span className="amount">₹{customer.totalDue.toLocaleString()}</span>
            </div>
            <div className="pending-transactions">
              <span className="label">Pending Transactions:</span>
              <span className="count">{pendingTransactions.length}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="payment-type-selector">
            <label>Payment Type:</label>
            <div className="payment-type-buttons">
              <button
                type="button"
                className={`payment-type-btn ${paymentType === 'partial' ? 'active' : ''}`}
                onClick={() => handlePaymentTypeChange('partial')}
              >
                Partial Payment
              </button>
              <button
                type="button"
                className={`payment-type-btn ${paymentType === 'lump' ? 'active' : ''}`}
                onClick={() => handlePaymentTypeChange('lump')}
              >
                Lump Sum Payment
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Payment Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={paymentData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Payment Amount *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={paymentData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                step="0.01"
                min="0.01"
                max={customer.totalDue}
                required
              />
              <div className="amount-hint">
                Max: ₹{customer.totalDue.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Payment Notes (Optional)</label>
              <input
                type="text"
                id="notes"
                name="notes"
                value={paymentData.notes}
                onChange={handleInputChange}
                placeholder="e.g., Part payment, Advance payment"
              />
            </div>
          </div>

          {paymentType === 'partial' && (
            <div className="transaction-selection">
              <label>Select Transactions to Pay (Optional):</label>
              <div className="transactions-list">
                {pendingTransactions.map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <label className="transaction-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={(e) => handleTransactionSelect(transaction.id, e.target.checked)}
                      />
                      <span className="transaction-info">
                        <span className="transaction-date">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        <span className="transaction-description">
                          {transaction.description}
                        </span>
                        <span className="transaction-amount">
                          ₹{parseFloat(transaction.amount).toLocaleString()}
                        </span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="selection-hint">
                💡 Select specific transactions or leave empty for general payment
              </div>
            </div>
          )}

          <div className="payment-preview">
            <div className="preview-item">
              <span className="label">Payment Amount:</span>
              <span className="value">₹{paymentData.amount || '0'}</span>
            </div>
            <div className="preview-item">
              <span className="label">Remaining Amount:</span>
              <span className="value remaining">
                ₹{paymentData.amount ? (customer.totalDue - parseFloat(paymentData.amount)).toLocaleString() : customer.totalDue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Process Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal; 