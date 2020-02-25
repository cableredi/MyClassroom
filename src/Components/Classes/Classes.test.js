import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import ClassesItems from './ClassItems/ClassItems';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const classesProps = [];

  ReactDOM.render(
    <BrowserRouter>
      <ClassesItems classes={classesProps} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});