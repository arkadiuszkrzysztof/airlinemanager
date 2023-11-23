import React from 'react'

import { Col } from 'react-bootstrap'

const TimetableHoursCol: React.FC<{ showLabels?: boolean }> = ({ showLabels }) => {
  return (
    <Col xs={'auto'} className='text-center text-grey-dark fw-bold'>
      <div className='timetable-grid mw-50'></div>
      <div className='timetable-hour mw-50'>{(showLabels === true) && <small>00:00</small>}</div>
      <div className='timetable-hour mw-50'>{(showLabels === true) && <small>04:00</small>}</div>
      <div className='timetable-hour mw-50'>{(showLabels === true) && <small>08:00</small>}</div>
      <div className='timetable-hour mw-50'>{(showLabels === true) && <small>12:00</small>}</div>
      <div className='timetable-hour mw-50'>{(showLabels === true) && <small>16:00</small>}</div>
      <div className='timetable-hour mw-50'>{(showLabels === true) && <small>20:00</small>}</div>
      <div className='timetable-hour mw-50'>{(showLabels === true) && <small>00:00</small>}</div>
    </Col>
  )
}

export default TimetableHoursCol
