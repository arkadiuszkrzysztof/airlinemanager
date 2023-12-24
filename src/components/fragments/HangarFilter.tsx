import React, { useEffect, type ReactElement } from 'react'
import { Regions } from '../../models/Airport'
import { AirlineController } from '../../controllers/AirlineController'
import { Col, Row } from 'react-bootstrap'
import { type HangarAsset } from '../../controllers/HangarController'
import Counter from './Counter'

interface Props {
  filter: string
  setFilter: (filter: string) => void
  items: HangarAsset[]
  setFilteredItems: (items: HangarAsset[]) => void
}

const ALL = 'ALL'

const HangarFilter: React.FC<Props> = ({ filter: region, setFilter: setRegion, items, setFilteredItems }): ReactElement => {
  const handleFilter = (key: string): void => {
    if (key === ALL) {
      setRegion(key)
      setFilteredItems(items.filter((item) => item))
    } else if (AirlineController.getInstance().unlockedRegions.includes(key)) {
      setRegion(key)
      setFilteredItems(items.filter((item) => item.plane.hub?.region === key))
    }
  }

  const getCountForRegion = (key: string): number => {
    if (key === ALL) {
      return items.filter((item) => item).length
    } else {
      return items.filter((item) => item.plane.hub?.region === key).length
    }
  }

  useEffect(() => {
    if (region !== '') {
      handleFilter(region)
    } else {
      handleFilter(ALL)
    }
  }, [items])

  return (
    <Row className='my-2 text-center justify-content-center'>
      <Col xs={'auto'}>
        <div
          className={`position-relative d-flex justify-content-center align-items-center bg-secondary rounded fw-bold cursor-pointer  ${region === ALL ? 'border border-2 border-primary' : 'border border-2 border-secondary'}`}
          style={{ width: '50px', height: '50px', boxSizing: 'border-box' }}
          onClick={() => { handleFilter(ALL) }}>
          {getCountForRegion(ALL) > 0 && <Counter count={getCountForRegion(ALL)} />}
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
              {getCountForRegion(key) > 0 && <Counter count={getCountForRegion(key)} />}
            </div>
        </Col>
      ))}
    </Row>
  )
}

export default HangarFilter
