import React from 'react';
import { NavLink } from 'react-router-dom';

export default function ClassItems(props) {
  const { schoolClass } = props;
  const isActive = (path, match, location) => !!(match || path === location.pathname);

  return (
    <>
      <NavLink
        to={`/updateClass/${schoolClass.class_id}`}
        isActive={isActive.bind(this, `classes/${schoolClass.class_id}`)}
      >
        <span className='class-list__name'>
          {schoolClass.class_name}
        </span>
        <div className='class-list_items'>
          <span className='class-list_items-header'>Days: </span>{schoolClass.days}
        </div>
        <div className='class-list_items'>
          <span className='class-list_items-header'>Times: </span>{schoolClass.times}
        </div>
        <div className='class-list_items'>
          <span className='class-list_items-header'>Location: </span>{schoolClass.location}
        </div>
        <div className='class-list_items'>
          <span className='class-list_items-header'>Room: </span>{schoolClass.room}
        </div>
      </NavLink>
    </>
  )
}