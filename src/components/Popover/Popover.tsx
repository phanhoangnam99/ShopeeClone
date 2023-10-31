import {
  ReferenceType,
  offset,
  useFloating,
  arrow,
  FloatingPortal,
  autoUpdate,
  shift,
  Placement
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useRef, useState, useId, ElementType } from 'react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
}

export default function Popover({
  children,
  className,
  renderPopover,
  as: Element = 'div',
  initialOpen,
  placement = 'bottom-end'
}: Props) {
  const arrowRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(initialOpen || false)
  const data = useFloating<ReferenceType>({
    open,
    onOpenChange: setOpen,
    middleware: [offset(6), arrow({ element: arrowRef }), shift()],
    whileElementsMounted: autoUpdate,
    transform: false,
    placement
  })

  const { refs, floatingStyles } = data

  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(false)
  }
  const id = useId()
  return (
    <Element
      className={className}
      onMouseEnter={() => showPopover()}
      onMouseLeave={() => hidePopover()}
      ref={refs.setReference}
    >
      {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                transform: ` scale(0)`
              }}
              animate={{ opacity: 1, transform: ` scale(1)` }}
              exit={{ opacity: 0, transform: ` scale(0)` }}
              // initial={{ opacity: 0, scale: 0, transform: floatingStyles.transform }}
              // animate={{ opacity: 1, transform: `${floatingStyles.transform} scale(1)` }}
              // exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
              ref={refs.setFloating}
              style={{
                transformOrigin: `${data.middlewareData.arrow?.x}px top`,
                ...floatingStyles
              }}
            >
              <span
                ref={arrowRef}
                className='absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-t-transparent border-b-white '
                style={{
                  left: data.middlewareData.arrow?.x,

                  top: data.middlewareData.arrow?.y
                }}
              />
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
