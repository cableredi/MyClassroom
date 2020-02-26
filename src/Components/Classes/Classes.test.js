import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import ClassesList from './ClassesList/ClassesList';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const classesProps = [];

  ReactDOM.render(
    <BrowserRouter>
      <ClassesList classes={classesProps} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});