import React, { useState, useEffect } from 'react';
import './User-Dashboard.css'; // Import the CSS file

const UserDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedNotifications = [
        { id: 1, message: 'Your rent is due on 25th Jan.' },
        { id: 2, message: 'Maintenance scheduled for 20th Jan.' },
      ];
      const fetchedBookings = [
        { id: 1, room: 'Room 101', status: 'Confirmed' },
        { id: 2, room: 'Room 102', status: 'Pending' },
      ];
      setNotifications(fetchedNotifications);
      setBookings(fetchedBookings);
    };

    fetchData();
  }, []);

  const handleDismissNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleCancelBooking = (id) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, User!</h1>
        <p>Manage your notifications and bookings here.</p>
      </header>

      <section className="dashboard-section">
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          <ul className="notifications-list">
            {notifications.map((notif) => (
              <li key={notif.id} className="notification-item">
                {notif.message}
                <button
                  className="action-button dismiss-button"
                  onClick={() => handleDismissNotification(notif.id)}
                >
                  Dismiss
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">No new notifications.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Your Bookings</h2>
        {bookings.length > 0 ? (
          <ul className="bookings-list">
            {bookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                <span>{`Room: ${booking.room} - Status: ${booking.status}`}</span>
                {booking.status === 'Pending' && (
                  <button
                    className="action-button cancel-button"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">No bookings available.</p>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
