import React, { useState, useContext } from 'react';
import styled from './Register.module.css';
import Loader from 'react-loader-spinner';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

export default function Register() {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { name, email, password } = formData;
  const [isLoading, setIsLoading] = useState(false);
  let history = useHistory();

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://infinite-wave-73400.herokuapp.com/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );
      const responseData = await response.json(); //token
      if (!response.ok) {
        setIsLoading(false);
        setError(responseData.errors[0].msg.toString());
        throw new Error(responseData.errors[0].msg.toString());
      }

      const response2 = await fetch(
        'https://infinite-wave-73400.herokuapp.com/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const response2Data = await response2.json();
      auth.login(response2Data);
      history.push('/home');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className={styled.loginBox}>
      <h2>Register</h2>
      <form>
        <p>Name</p>
        <input
          type='text'
          name='name'
          placeholder='Enter Name'
          value={name}
          onChange={onChangeHandler}
          required
        />
        <p>Email</p>
        <input
          type='email'
          name='email'
          placeholder='Enter Email'
          vale={email}
          onChange={onChangeHandler}
          required
        />
        <p>Password</p>
        <input
          type='password'
          name='password'
          placeholder='******'
          value={password}
          onChange={onChangeHandler}
          required
          minLength='8'
        />
        {isLoading === false || error !== '' ? (
          <input
            type='submit'
            name=''
            value='Register'
            onClick={onSubmitHandler}
          />
        ) : (
          <Loader type='ThreeDots' color='#ff267e' />
        )}
        <p>
          {' '}
          <Link to='/login'>Sign In</Link>
        </p>
        {error && <div className={styled.error}>{error}</div>}
      </form>
    </div>
  );
}
