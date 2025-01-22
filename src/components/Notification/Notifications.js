import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../../redux/actions/notificationActions';
import './notifications.css';

const Notifications = () => {
  const notifications = useSelector((state) => state.notifications.notifications);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="notification-container">
      {notifications.length === 0 ? (
        <p className="no-notifications">No new notifications</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="notification">
            <p className="notification-message">{notification.message}</p>
            <button
              className="dismiss-button"
              onClick={() => handleRemove(notification.id)}
            >
              Dismiss
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
