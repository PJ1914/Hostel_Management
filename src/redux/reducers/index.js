import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Import your individual reducers

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer, // Example reducer, add more as needed
});

export default rootReducer;
