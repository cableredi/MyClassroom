import React from 'react';
import ReactDOM from 'react-dom';
import AddStudentLogin from './AddStudentLogin';
import TokenService from '../../../Services/token-service';
const jwt = require('jsonwebtoken');

it('renders without crashing', () => {
  const div = document.createElement('div');

  const testUser = {
    user_name: 'test',
    user_id: 123
  }

  const expectedToken = jwt.sign(
    { user_id: testUser.user_id },
    'this is a test',
    {
      subject: testUser.user_name,
      algorithm: 'HS256',
    },
  );

  TokenService.saveAuthToken(expectedToken);

  ReactDOM.render( <AddStudentLogin />, div );
  ReactDOM.unmountComponentAtNode(div);
});