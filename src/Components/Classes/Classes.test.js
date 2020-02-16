import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Classes from './Classes';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const classesProps = [];

  ReactDOM.render(
    <BrowserRouter>
      <Classes classes={classesProps} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});