import React from 'react';
import { 
  BrowserRouter, 
  Switch, 
  Route, 
  Redirect 
} from 'react-router-dom';
import Navbar from './components/Shared/Navbar';
import Login from './components/Auth/Login';
import Signin from './components/Auth/Signin';
import UserDashboard from './components/Dashboard/User-Dashboard';
import PaymentForm from './components/Payment/PaymentForm';
import Notifications from './components/Notification/Notifications';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem('token') ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signin" component={Signin} />
        <PrivateRoute exact path="/dashboard" component={UserDashboard} />
        <PrivateRoute exact path="/payment" component={PaymentForm} />
        <PrivateRoute exact path="/notifications" component={Notifications} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
