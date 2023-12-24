import React from 'react'
import { AirplaneFill } from 'react-bootstrap-icons'
import { type ErrorResponse, useRouteError } from 'react-router-dom'
import { GameController } from '../controllers/GameController'
import { Link } from 'react-router-dom'

const ErrorPage: React.FC = () => {
  const error = useRouteError() as ErrorResponse

  return (
    <div id="error-page">
      <h1 className='mb-5'><AirplaneFill size={40} className='rotate-135' /> Oops!</h1>
      <p className='text-center'>
        Sorry, an unexpected error has occurred. Please try refreshing the page.<br />
        If that doesn&apos;t help, <Link to={'https://linktr.ee/razuponatime'} target='_blank' className='text-decoration-none text-info fw-bold'>contact me</Link> and attach the below error message and your <span role='button' className='text-secondary fw-bold' onClick={GameController.downloadSaveJSON}>Save File</span>.</p>
      <p>
        <i>{error.statusText ?? ('message' in error ? error.message as string : 'Unknown error')}</i>
      </p>
    </div>
  )
}

export default ErrorPage
