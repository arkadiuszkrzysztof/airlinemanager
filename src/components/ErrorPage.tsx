import React from 'react'
import { AirplaneFill } from 'react-bootstrap-icons'
import { type ErrorResponse, useRouteError } from 'react-router-dom'

const ErrorPage: React.FC = () => {
  const error = useRouteError() as ErrorResponse

  return (
    <div id="error-page">
      <h1 className='mb-5'><AirplaneFill size={40} className='rotate-135' /> Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText ?? ('message' in error ? error.message as string : 'Unknown error')}</i>
      </p>
    </div>
  )
}

export default ErrorPage
