import React from 'react'

import { FieldProps } from '../../types'
import FieldGroup from '../FieldGroup'

import Datepicker from './Datepicker'
import Input from './Input'

type Props = JSX.IntrinsicElements['input'] &
  FieldProps & {
    patternErrorMessage?: string
  }

const InputWithLabel: React.FC<Props> = ({
  alias,
  caption,
  condition,
  helpText,
  required,
  ...props
}) => {
  if (props.type === 'date') {
    return (
      <FieldGroup
        alias={alias}
        caption={caption}
        condition={condition}
        helpText={helpText}
        required={required}
      >
        <Datepicker alias={alias} required={required} {...props} />
      </FieldGroup>
    )
  }
  return (
    <FieldGroup
      alias={alias}
      caption={caption}
      condition={condition}
      helpText={helpText}
      required={required}
    >
      <Input type="text" alias={alias} required={required} {...props} />
    </FieldGroup>
  )
}

InputWithLabel.displayName = 'InputWithLabel'

export default InputWithLabel
