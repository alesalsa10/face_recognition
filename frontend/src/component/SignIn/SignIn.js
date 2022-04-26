import React, { useState, useContext } from 'react';
import styled from './SignIn.module.css';
import Loader from 'react-loader-spinner';
import { useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

export default function SignIn() {
  const auth = useContext(AuthContext);
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData; //distructuring formdata
  let history = useHistory('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
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
      const responseData = await response.json(); //token
      if (!response.ok) {
        console.log(responseData)
        setIsLoading(false);
        setError('Invalid credentials');
        throw new Error(responseData.errors[0].msg.toString());
      } 
      auth.login(responseData);
      history.push('/home')
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styled.loginBox}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <p>Email</p>
        <input
          type='email'
          name='email'
          placeholder='Enter Email'
          value={email}
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
          minLength="8"
          required
        />
        {isLoading === false || error !== '' ? (
          <input type='submit' name='' value='Sign In' onClick={handleSubmit} />
        ) : (
          <Loader type='ThreeDots' color='#ff267e' />
        )}
        <p>
          {' '}
          <Link to='/register'>Register</Link>
        </p>
      </form>
      {error && <div className={styled.error}>{error}</div>}
    </div>
  );
}
