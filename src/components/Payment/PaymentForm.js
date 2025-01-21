import React, { useState } from 'react';
import axios from 'axios';
import './PaymentForm.css'; // Import CSS file

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/payment', { amount, paymentMethod });
      alert('Payment successful!');
      setAmount('');
      setPaymentMethod('credit_card');
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Hostel Payment</h2>
      <p>Pay your hostel dues securely using our payment system.</p>
      <form onSubmit={handlePayment} className="payment-form">
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI</option>
            <option value="net_banking">Net Banking</option>
          </select>
        </div>
        <button type="submit" className="payment-button" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
