import React, { useCallback } from 'react'

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

const Select: React.FC<Props> = ({
  alias,
  caption,
  condition,
  helpText,
  preValues,
  required,
}) => {
  //const ref = useRef<HTMLSelectElement>(null)
  const { currentValue, error, registerField } = useField(alias)
  helpText = helpText || "Please select a value";
  const ref = useCallback(
    node => {
      registerField({
        name: alias,
        ref: node,
      })
    },
    [alias, registerField],
  )

  const renderOption = (value: string, name: string) => {
    return (
      <option key={value} value={value}>
        {name}
      </option>
    )
  }

  const renderOptions = (values: object | []) => {
    if (values instanceof Array) return values.map(x => renderOption(x, x))

    const kv = values as KeyValue

    return Object.keys(values).map(x => renderOption(x, kv[x]))
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
        <select
          name={alias}
          id={alias}
          defaultValue={currentValue as string}
          ref={ref}
          required={required}
        >
          <option>{helpText}</option>
          {renderOptions(preValues)}
        </select>
        {error && <span>{error}</span>}
      </div>
    </FieldGroup>
  )
}

Select.displayName = 'Select'

export default Select
