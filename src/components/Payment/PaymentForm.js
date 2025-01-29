import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createPayment } from '../../services/api';
import './PaymentForm.css';

const PaymentForm = () => {
  const history = useHistory();
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking'
  const [formData, setFormData] = useState({
    // Card details
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    // UPI details
    upiId: '',
    // NetBanking details
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    // Common
    amount: '',
    month: '',
    year: new Date().getFullYear(),
    paymentDetails: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch(name) {
      case 'cardNumber':
        formattedValue = value.replace(/[^\d]/g, '')
                             .replace(/(.{4})/g, '$1 ')
                             .trim();
        break;
      case 'expiryDate':
        formattedValue = value.replace(/[^\d]/g, '')
                             .replace(/^(.{2})(.)/g, '$1/$2')
                             .substring(0, 5);
        break;
      case 'cvv':
        formattedValue = value.replace(/[^\d]/g, '').substring(0, 3);
        break;
      case 'upiId':
        formattedValue = value.toLowerCase();
        break;
      case 'amount':
        formattedValue = value.replace(/[^\d.]/g, '');
        if (formattedValue.split('.').length > 2) formattedValue = formattedValue.replace(/\.+$/, '');
        break;
      default:
        formattedValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      errors.push('Invalid amount');
    }

    switch(paymentMethod) {
      case 'card':
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
          errors.push('Invalid card number');
        }
        if (formData.cvv.length !== 3) {
          errors.push('Invalid CVV');
        }
        if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
          errors.push('Invalid expiry date');
        }
        break;
      case 'upi':
        if (!formData.upiId.includes('@')) {
          errors.push('Invalid UPI ID');
        }
        break;
      case 'netbanking':
        if (!formData.bankName) {
          errors.push('Please select a bank');
        }
        if (!formData.accountNumber || formData.accountNumber.length < 9) {
          errors.push('Invalid account number');
        }
        if (!formData.ifscCode || !formData.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) {
          errors.push('Invalid IFSC code');
        }
        break;
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const errors = validateForm();
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      await createPayment({
        ...formData,
        paymentType: paymentMethod
      });
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentForm = () => {
    switch(paymentMethod) {
      case 'card':
        return (
          <>
            <div className="virtual-card">
              <div className="card-front">
                <div className="chip"></div>
                <div className="card-number">
                  {formData.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="card-details">
                  <div className="card-holder">
                    <span>Card Holder</span>
                    <div>{formData.cardHolder || 'YOUR NAME'}</div>
                  </div>
                  <div className="expiry">
                    <span>Expires</span>
                    <div>{formData.expiryDate || 'MM/YY'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>

            <div className="form-group">
              <label>Card Holder Name</label>
              <input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                placeholder="Enter card holder name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="***"
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </>
        );

      case 'upi':
        return (
          <div className="upi-section">
            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                placeholder="yourname@upi"
                required
              />
            </div>
            <div className="upi-logos">
              <img src="/gpay-logo.png" alt="Google Pay" />
              <img src="/phonepe-logo.png" alt="PhonePe" />
              <img src="/paytm-logo.png" alt="Paytm" />
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <>
            <div className="form-group">
              <label>Select Bank</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                {/* Add more banks as needed */}
              </select>
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                required
              />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                placeholder="Enter IFSC code"
                required
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form-wrapper">
        <form onSubmit={handleSubmit} className="payment-form">
          <h2>Payment Details</h2>
          
          <div className="payment-methods">
            <button
              type="button"
              className={`method-button ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              Credit/Debit Card
            </button>
            <button
              type="button"
              className={`method-button ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              UPI
            </button>
            <button
              type="button"
              className={`method-button ${paymentMethod === 'netbanking' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              Net Banking
            </button>
          </div>

          {renderPaymentForm()}

          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`submit-button ${loading ? 'processing' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm; 