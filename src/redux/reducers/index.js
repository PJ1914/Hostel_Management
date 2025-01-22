import { combineReducers } from 'redux';
import authReducer from './authReducer'; 
import notificationReducer from './notificationReducer';


// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer, 
  notifications: notificationReducer,
});

export default rootReducer;
