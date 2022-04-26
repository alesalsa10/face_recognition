import { useState, useCallback, Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Navigation from './component/Navigation/Navigation';
import Logo from './component/Logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai';
import FaceDetection from './component/FaceDetection/FaceDetection';
import SignIn from './component/SignIn/SignIn';
import Register from './component/Register/Register';
import { AuthContext } from './context/authContext';

function App() {
  const app = new Clarifai.App({
    apiKey: '91db33c5ded04e58a28cf9ca717157f0',
  });

  const [userData, setUserData] = useState('');
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [boxes, setBoxes] = useState([]);
  const [token, setToken] = useState('');
  const [recognitionError, setRecognitionError] = useState('');
  const [message, setMessage] = useState('');
  const [userID, setUserID] = useState();

  const login = useCallback((token) => {
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const getUserID = useCallback((id) => {
    setUserID(id)
  }, [])

  const calculateFaceLocation = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions.map(
      (region) => region.region_info.bounding_box
    );
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFaces.map((face) => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - face.right_col * width,
        bottomRow: height - face.bottom_row * height,
      };
    });
  };

  const displayFaceBox = (boxes) => {
    setBoxes(boxes);
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = async () => {
    setUrl(input);
    let responseObj;
    await app.models.predict(Clarifai.FACE_DETECT_MODEL, input).then(
      async function (response) {
        responseObj = await response.outputs[0].data;
        if (Object.keys(responseObj).length !== 0) {
          displayFaceBox(calculateFaceLocation(response));
          setMessage('');
        } else {
          setBoxes([]);
          setMessage('No faces found');
        }
      },
      function (err) {
        console.log(err);
        setRecognitionError('Something went wrong, try again later');
      }
    );
    try {
      let faceNumber = responseObj === undefined || responseObj.regions === undefined ? 0: responseObj.regions.length;
      const response = await fetch(
        'https://infinite-wave-73400.herokuapp.com/' + userID + '/' + faceNumber,
        {
          method: 'PUT',
          headers: {
            'auth-token': token.token,
          },
        }
      );
      const updatedUser = await response.json();
      setUserData({ ...userData, count: updatedUser.count }); 
    } catch (err) {
      console.log(err);
    }
  };

  let routes;

  if (token) {
    routes = (
      <Fragment>
        <Navigation />
        <Route
          exact
          path='/home'
          render={() => (
            <Fragment>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={onInputChange}
                onButtonSubmit={onSubmit}
              />
              <FaceDetection
                boxes={boxes}
                url={url}
                recognitionError={recognitionError}
                message={message}
              />
            </Fragment>
          )}
        />
        <Redirect to='/' />
      </Fragment>
    );
  } else {
    routes = (
      <Fragment>
        <Route exact path='/' Redirect to='/login' />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={SignIn} />
        <Redirect to='/login' />
      </Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        getUserID: getUserID
      }}
    >
      <div className='App'>
        <Particles
          className='partciles'
          params={{
            particles: {
              number: {
                value: 100,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
            },
          }}
        />

        <Router>
          <Fragment>
            <Switch>{routes}</Switch>
          </Fragment>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
