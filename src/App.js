import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Signin';
import UserDashboard from './components/Dashboard/User-Dashboard';
import PaymentForm from './components/Payment/PaymentForm';
import Notifications from './components/Notification/Notifications';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dashboard" component={UserDashboard} />
        <Route exact path="/payment" component={PaymentForm} />
        <Route exact path="/notifications" component={Notifications} />
      </Switch>
    </Router>
  );
}

export default App;
