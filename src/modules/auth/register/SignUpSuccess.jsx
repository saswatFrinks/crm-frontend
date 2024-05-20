import { modalAtom } from '@/shared/states/modal.state'
import Button from '@/shared/ui/Button'
import { ModalBody, ModalHeader } from '@/shared/ui/Modal'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

const SignUpSuccess = () => {
  const navigate = useNavigate();
  const setOpen = useSetRecoilState(modalAtom);

  return (
    <div>
      <ModalHeader>Verify Email</ModalHeader>

      <ModalBody>
        <p>An email with the verification link has been sent to your registered email id. Please click on the verification link to verify your email and start using the application.</p>
        <div className="flex flex-row-reverse">
          <Button fullWidth={false} style={{padding: '0.5rem 1.5rem'}} color="flat" onClick={() => {
            navigate('/login');
            setOpen(false);
          }}>
            Login
          </Button>
        </div>
      </ModalBody>
    </div>
  )
}

export default SignUpSuccess
