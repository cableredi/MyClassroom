import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import CalendarDate from './CalendarDate';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const assignmentsProps = [];

  ReactDOM.render(
    <BrowserRouter>
      <CalendarDate classes={assignmentsProps} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});