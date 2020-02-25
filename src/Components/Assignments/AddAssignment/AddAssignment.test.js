import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import AddAssignment from './AddAssignment';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const classesProps = [];

  ReactDOM.render(
    <BrowserRouter>
      <AddAssignment 
        classes={classesProps} 
        match={{params: {selectedDate: new Date()}, isExact: true, path: "", url: ""}}
      />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});