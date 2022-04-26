import React, { useEffect, useState, useContext } from 'react';
import styled from './Rank.module.css';
import { AuthContext } from '../../context/authContext';
import Loader from 'react-loader-spinner';

export default function Rank() {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState('');

  useEffect(() => {
    let unmounted = false;
    const getUserData = async (token) => {
      const res = await fetch(
        'https://infinite-wave-73400.herokuapp.com/profile',
        {
          headers: {
            'auth-token': token,
          },
        }
      );
      if (!unmounted) {
        const resData = await res.json();
        auth.getUserID(resData._id)
        setUser(resData);
      }
    };
    getUserData(auth.token.token);
    return () => {
      unmounted = true;
    };
  }, [auth]);

  return user === '' ? (
    <Loader type='ThreeDots' color='#ff267e' />
  ) : (
    <div>
      <div className={styled.header}>
        {user.name + ', you have detected a total of ...'}
      </div>
      <div className={styled.number}>{user.count}  faces so far</div>
    </div>
  );
}
