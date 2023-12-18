import React, { type ReactElement } from 'react'
import { Button, Card, Col } from 'react-bootstrap'

import { FileEarmarkArrowDownFill, Gear, TrashFill } from 'react-bootstrap-icons'
import { GameController } from '../../controllers/GameController'
import AirlineNameForm from '../fragments/AirlineNameForm'

interface Props {
  fullWidth?: boolean
}

const AboutWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const [name, setName] = React.useState<string>(GameController.getInstance().Airline.name)

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    GameController.updateAirlineName(name.trim())
  }

  return (
    <Col xs={fullWidth ? 12 : 8} xl={fullWidth ? 12 : 6} xxl={fullWidth ? 10 : 5}>
      <Card className='p-0 m-2 widget-shadow' >
        <Card.Header className='position-sticky d-flex align-items-center justify-content-between'>
          <div className='d-flex align-items-center'>
            <Gear size={24} className='text-dark me-2' />
            <span className='text-dark fw-bold fs-5'>Settings</span>
          </div>
        </Card.Header>
        <Card.Body className='d-flex flex-column align-items-center mh-400 overflow-auto pt-0 pb-2' style={{ height: '320px' }}>
          <div className='text-center'>
            <div className='text-info small fw-bold mb-2'>AIRLINE NAME</div>
            <AirlineNameForm name={name} setName={setName} onSubmitHandler={onSubmitHandler} />
          </div>
          <div className='text-center justify-content-center d-flex flex-column'>
            <div className='text-info small fw-bold mb-2 mt-4'>GAME SAVE</div>
            <Button variant='secondary' className=' justify-content-center align-items-center d-flex text-white'><FileEarmarkArrowDownFill size={16} className='me-2' role='button' title='Download Save File' onClick={GameController.downloadSaveJSON} />Download Save File</Button>
            <Button variant='danger' className='justify-content-center align-items-center d-flex text-white mt-2'><TrashFill size={16} className='me-2' role='button' title='Delete Game' onClick={GameController.deleteGame} />Delete Game</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default AboutWidget
