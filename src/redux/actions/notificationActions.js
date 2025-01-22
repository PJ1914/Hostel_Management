export const addNotification = (message) => {
    return {
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(), // Unique ID for each notification
        message,
      },
    };
  };
  
  export const removeNotification = (id) => {
    return {
      type: 'REMOVE_NOTIFICATION',
      payload: id,
    };
  };
  