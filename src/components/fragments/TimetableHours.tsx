import React from 'react'

import { Col } from 'react-bootstrap'

const TimetableHoursCol: React.FC = () => {
  return (
    <Col xs={'auto'} className='text-center text-grey-dark'>
      <div className='timetable-grid mw-50'></div>
      <div className='timetable-hour mw-50'><small>00:00</small></div>
      <div className='timetable-hour mw-50'><small>04:00</small></div>
      <div className='timetable-hour mw-50'><small>08:00</small></div>
      <div className='timetable-hour mw-50'><small>12:00</small></div>
      <div className='timetable-hour mw-50'><small>16:00</small></div>
      <div className='timetable-hour mw-50'><small>20:00</small></div>
      <div className='timetable-hour mw-50' style={{ height: '20px' }}><small>00:00</small></div>
    </Col>
  )
}

export default TimetableHoursCol
