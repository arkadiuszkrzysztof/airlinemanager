import React, { useState } from 'react'

interface Props {
  story: string
}

const CreateAirline: React.FC<Props> = (props) => {
  const [name, setName] = useState('')

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    console.log(name)
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <div>
        <label htmlFor="name">Airline Name</label>
        <input type="text" id="name" value={name} onChange={(e) => { setName(e.target.value) }} />
      </div>
      <button type="submit">Create Airline</button>
    </form>
  )
}

export default CreateAirline
