import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import CalendarDate from './CalendarDate';
import TokenService from '../../../Services/token-service';
const jwt = require('jsonwebtoken');

it.only('renders without crashing', () => {
  const div = document.createElement('div');

  const assignmentsProps = [];

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

  ReactDOM.render(
    <BrowserRouter>
      <CalendarDate 
        classes={assignmentsProps} 
        match={{params: {date: new Date()}, isExact: true, path: "", url: ""}}
      />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});