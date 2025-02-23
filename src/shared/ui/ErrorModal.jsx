import React from 'react'
import { ModalBody, ModalHeader } from './Modal'
import Button from './Button'
import { useRecoilState } from 'recoil'
import { modalAtom } from '../states/modal.state'
import Cross from '../icons/Cross'

const ErrorModal = ({error, setOpenModal = null}) => {
  const [open, setOpen] = useRecoilState(modalAtom);

  if(!error)setOpen(false);

  return (
    <>
      <ModalHeader></ModalHeader>
      <ModalBody>
        <div className="flex flex-col items-center gap-4 my-2">
          <div className="border-8 rounded-full bg-white p-4">
            <Cross />
          </div>
          <div className="text-center text-lg font-medium">{error}</div>
          <Button 
            color='primary'
            fullWidth={false}
            onClick={() => {
              if(setOpenModal)setOpenModal(false)
              else setOpen(false)
            }}
          >
            OK
          </Button>
        </div>
      </ModalBody>
    </>
  )
}

export default ErrorModal
