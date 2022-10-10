import React, { useCallback } from 'react'
import Select, { SingleValue } from 'react-select'

import useField from '../../hooks/useField'
import { FieldProps } from '../../types'
import FieldGroup from '../FieldGroup'

interface KeyValue {
  [key: string]: string
}

type Props = JSX.IntrinsicElements['select'] &
  FieldProps & {
    preValues: []
  }

const FormSelecSelect: React.FC<Props> = ({
  alias,
  caption,
  condition,
  helpText,
  preValues,
  required,
}) => {
  // const ref = React.useRef<HTMLSelectElement>(null)
  const { currentValue, error, registerField } = useField(alias)
  helpText = helpText || 'Please select a value'
  const ref = useCallback(
    node => {
      registerField({
        name: alias,
        ref: node,
      })
    },
    [alias, registerField],
  )

  const [isOpen, setIsOpen] = React.useState(false)

  const handleOptionsList = (list: object | []) => {
    if (list instanceof Array) {
      return list.map((item: string) => ({
        label: item,
        value: item,
      }))
    }
  }

  return (
    <FieldGroup
      alias={alias}
      caption={caption}
      condition={condition}
      helpText={helpText}
      required={required}
    >
      <div className="select-container">
        <Select
          placeholder={helpText}
          id={alias}
          classNamePrefix="dropdown"
          onMenuOpen={() => setIsOpen(true)}
          onMenuClose={() => setIsOpen(false)}
          defaultInputValue={currentValue as string}
          options={handleOptionsList(preValues)}
          itemRef={ref}
        />
        {error && <span>{error}</span>}
      </div>
    </FieldGroup>
  )
}

FormSelecSelect.displayName = 'Select'

export default FormSelecSelect
