import React, { useContext } from 'react';
import styled from './Navigation.module.css';
import { AuthContext } from '../../context/authContext';
import { useHistory } from 'react-router-dom';

export default function Navigation({ onRouteChange, isSignedIn }) {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const logoutClick = () => {
    auth.logout();
    history.push('/login');
  };

  return (
    <nav className={styled.navigationLink}>
      <p onClick={logoutClick} className={styled.signInOut}>
        Sign Out
      </p>
    </nav>
  );
}
