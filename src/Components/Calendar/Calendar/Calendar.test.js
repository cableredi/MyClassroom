import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Calendar from './Calendar';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const assignmentsProps = [];

  ReactDOM.render(
    <BrowserRouter>
      <Calendar assignments={assignmentsProps} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});