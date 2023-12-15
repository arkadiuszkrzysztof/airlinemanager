import React, { useState, type ReactElement } from 'react'
import { Regions } from '../../models/Airport'
import { AirlineController } from '../../controllers/AirlineController'
import { Col, Row } from 'react-bootstrap'
import { type HangarAsset } from '../../controllers/HangarController'

interface Props {
  items: HangarAsset[]
  filter: (items: HangarAsset[]) => void
}

const ALL = 'ALL'

const HangarFilter: React.FC<Props> = ({ items, filter }): ReactElement => {
  const [region, setRegion] = useState(ALL)

  const handleFilter = (key: string): void => {
    if (key === ALL) {
      setRegion(key)
      filter(items.filter((item) => item))
    } else if (AirlineController.getInstance().unlockedRegions.includes(key)) {
      setRegion(key)
      filter(items.filter((item) => item.plane.hub?.region === key))
    }
  }

  const getCountForRegion = (key: string): number => {
    if (key === ALL) {
      return items.filter((item) => item).length
    } else {
      return items.filter((item) => item.plane.hub?.region === key).length
    }
  }

  return (
    <Row className='my-2 text-center justify-content-center'>
      <Col xs={'auto'}>
        <div
          className={`position-relative d-flex justify-content-center align-items-center bg-info rounded fw-bold cursor-pointer  ${region === ALL ? 'border border-2 border-primary' : 'border border-2 border-info'}`}
          style={{ width: '50px', height: '50px', boxSizing: 'border-box' }}
          onClick={() => { handleFilter(ALL) }}>
          {getCountForRegion(ALL) > 0 && <span className={`position-absolute bg-primary rounded-circle text-white fw-bold ${getCountForRegion(ALL) > 9 ? 'px-1' : 'px-2'}`} style={{ bottom: '-5px', right: '-10px' }}>
            {getCountForRegion(ALL)}
          </span>}
          ALL
        </div>
      </Col>
      {Object.keys(Regions).map((key) => (
        <Col xs={'auto'} key={key}>
          <div className='position-relative' style={{ width: '50px' }}>
            <img
              src={`/images/region-${key.toLocaleLowerCase()}.png`}
              alt={Regions[key as keyof typeof Regions]}
              className={`rounded ${AirlineController.getInstance().unlockedRegions.includes(key) ? 'cursor-pointer' : 'grayscale opacity-50'} ${region === key ? 'border border-2 border-primary' : ''}`}
              style={{ maxWidth: '50px' }}
              onClick={() => { handleFilter(key) }} />
              {getCountForRegion(key) > 0 && <span className={`position-absolute bg-primary rounded-circle text-white fw-bold ${getCountForRegion(key) > 9 ? 'px-1' : 'px-2'}`} style={{ bottom: '-5px', right: '-10px' }}>
                {getCountForRegion(key)}
              </span>}
            </div>
        </Col>
      ))}
    </Row>
  )
}

export default HangarFilter
