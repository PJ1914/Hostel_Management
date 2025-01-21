import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correct named import
import rootReducer from './reducers'; // Import your combined reducers

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
