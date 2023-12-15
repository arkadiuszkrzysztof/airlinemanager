import React, { type ReactElement, useContext } from 'react'
import { AccordionContext, useAccordionButton } from 'react-bootstrap'
import { CaretDownFill } from 'react-bootstrap-icons'

interface Props {
  children?: ReactElement
  eventKey: string
  callback?: (eventKey: string) => void
  iconSize?: number
}

const ContentToggle: React.FC<Props> = ({ children, eventKey, callback, iconSize }) => {
  const { activeEventKey } = useContext(AccordionContext)

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => { if (callback !== undefined) callback(eventKey) }
  )

  const isCurrentEventKey = activeEventKey === eventKey

  return (
    <CaretDownFill
      onClick={decoratedOnClick}
      role="button"
      size={iconSize ?? 40}
      className={`text-secondary rotate-${isCurrentEventKey ? '180' : '0'}`} />
  )
}

export default ContentToggle
