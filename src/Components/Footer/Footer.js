import React from 'react';
import {
  format
} from 'date-fns'

export default function Footer() {
  const copyrightDate = format(new Date(), 'yyyy')
  return (
    <address className='Footer'>
      <div className='Footer__content'>MyClassroom - <span className="Calendar__icon">copyright</span> {copyrightDate}</div>
    </address>
  )
}