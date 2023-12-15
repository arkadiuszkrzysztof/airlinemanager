import React from 'react'

const TimetableGrid: React.FC<{ showLabels?: boolean }> = ({ showLabels }) => {
  return (
    <>
      <div className='timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top timetable-grid'></div>
      <div className='border-top border-bottom timetable-grid'></div>
      <div className='timetable-grid'></div>
    </>
  )
}

export default TimetableGrid
