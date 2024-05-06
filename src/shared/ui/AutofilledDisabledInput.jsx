import React from 'react'
import Input from './Input'

const AutofilledDisabledInput = ({value}) => {
  return (
    <Input
        type="text"
        disabled={true}
        value={value}
        style={{
            marginBottom: 0
        }}
    />
  )
}

export default AutofilledDisabledInput
