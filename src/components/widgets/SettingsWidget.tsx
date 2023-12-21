import React, { type ReactElement } from 'react'
import { Button, ButtonGroup, Card, Col } from 'react-bootstrap'

import { FileEarmarkArrowDownFill, Gear, TrashFill } from 'react-bootstrap-icons'
import { type DistanceUnits, GameController, type SpeedUnits, type WeightUnits } from '../../controllers/GameController'
import AirlineNameForm from '../fragments/AirlineNameForm'
import { LocalStorage } from '../../controllers/helpers/LocalStorage'

interface Props {
  fullWidth?: boolean
}

const AboutWidget: React.FC<Props> = ({ fullWidth = false }): ReactElement => {
  const [name, setName] = React.useState<string>(GameController.getInstance().Airline.name)
  const [distanceUnits, setDistanceUnits] = React.useState<string>(LocalStorage.getDistanceUnits())
  const [speedUnits, setSpeedUnits] = React.useState<string>(LocalStorage.getSpeedUnits())
  const [weightUnits, setWeightUnits] = React.useState<string>(LocalStorage.getWeightUnits())

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    GameController.updateAirlineName(name.trim())
  }

  const onDistanceUnitsChange = (units: DistanceUnits): void => {
    GameController.updateDistanceUnits(units)
    setDistanceUnits(units)
  }

  const onSpeedUnitsChange = (units: SpeedUnits): void => {
    GameController.updateSpeedUnits(units)
    setSpeedUnits(units)
  }

  const onWeightUnitsChange = (units: WeightUnits): void => {
    GameController.updateWeightUnits(units)
    setWeightUnits(units)
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
        <Card.Body className='d-flex flex-column align-items-center overflow-auto pt-0 pb-2'>
          <div className='text-center'>
            <div className='text-info small fw-bold mb-2'>AIRLINE NAME</div>
            <AirlineNameForm name={name} setName={setName} onSubmitHandler={onSubmitHandler} />
          </div>
          <div className='text-center'>
            <div className='text-info small fw-bold mb-2 mt-4'>DISPLAY UNITS</div>
            <div>
              Distance:
              <ButtonGroup className='ms-2'>
                <Button variant={distanceUnits === 'km' ? 'secondary' : 'light'} className='text-white' onClick={() => { onDistanceUnitsChange('km') }}>Kilometers</Button>
                <Button variant={distanceUnits === 'mi' ? 'secondary' : 'light'} className='text-white' onClick={() => { onDistanceUnitsChange('mi') }}>Miles</Button>
                <Button variant={distanceUnits === 'nmi' ? 'secondary' : 'light'} className='text-white' onClick={() => { onDistanceUnitsChange('nmi') }}>Nautical Miles</Button>
              </ButtonGroup>
            </div>
            <div className='mt-2'>
              Speed:
              <ButtonGroup className='ms-2'>
                <Button variant={speedUnits === 'kph' ? 'secondary' : 'light'} className='text-white' onClick={() => { onSpeedUnitsChange('kph') }}>km/h</Button>
                <Button variant={speedUnits === 'mph' ? 'secondary' : 'light'} className='text-white' onClick={() => { onSpeedUnitsChange('mph') }}>mph</Button>
                <Button variant={speedUnits === 'kts' ? 'secondary' : 'light'} className='text-white' onClick={() => { onSpeedUnitsChange('kts') }}>knots</Button>
              </ButtonGroup>
            </div>
            <div className='mt-2'>
              Weight:
              <ButtonGroup className='ms-2'>
                <Button variant={weightUnits === 'kg' ? 'secondary' : 'light'} className='text-white' onClick={() => { onWeightUnitsChange('kg') }}>Kilograms</Button>
                <Button variant={weightUnits === 'lb' ? 'secondary' : 'light'} className='text-white' onClick={() => { onWeightUnitsChange('lb') }}>Pounds</Button>
              </ButtonGroup>
            </div>
          </div>
          <div className='text-center justify-content-center d-flex flex-column mb-4'>
            <div className='text-info small fw-bold mb-2 mt-4'>GAME SAVE</div>
            <Button variant='secondary' className=' justify-content-center align-items-center d-flex text-white' onClick={GameController.downloadSaveJSON}><FileEarmarkArrowDownFill size={16} className='me-2' role='button' title='Download Save File' />Download Save File</Button>
            <Button variant='danger' className='justify-content-center align-items-center d-flex text-white mt-2' onClick={GameController.deleteGame}><TrashFill size={16} className='me-2' role='button' title='Delete Game' />Delete Game</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default AboutWidget
