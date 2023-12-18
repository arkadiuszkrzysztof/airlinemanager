import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { ChevronRight } from 'react-bootstrap-icons'

interface Props {
  name: string
  setName: (name: string) => void
  onSubmitHandler: (event: React.FormEvent<HTMLFormElement>) => void
}

const AirlineNameForm: React.FC<Props> = ({ name, setName, onSubmitHandler }) => {
  return (
    <Form onSubmit={onSubmitHandler}>
      <div className='d-flex'>
        <Form.Control
          type="text"
          placeholder='Airline Name'
          id="name"
          value={name}
          onChange={(e) => { setName(e.target.value) }}
          className='fs-4 text-center rounded-left border-primary'
          style={{ width: '400px' }}
          maxLength={24}
          autoComplete='off' />
        <Button type="submit" className='rounded-right' disabled={name.trim().length < 3}><ChevronRight size={24} className='text-white' /></Button>
      </div>
    </Form>
  )
}

export default AirlineNameForm
