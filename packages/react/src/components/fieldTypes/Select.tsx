import React, { useCallback } from 'react'
import Select, { SingleValue } from 'react-select'

import useField from '../../hooks/useField'
import { FieldProps } from '../../types'
import FieldGroup from '../FieldGroup'

interface KeyValue {
  [key: string]: string
}

type Props = JSX.IntrinsicElements['input'] &
  FieldProps & {
    preValues: []
  } & {
    alias: string
    requiredErrorMessage?: string
    patternInvalidErrorMessage?: string
  }

const FormSelecSelect: React.FC<Props> = ({
  alias,
  caption,
  condition,
  helpText,
  preValues,
  required,
  placeholder,
  pattern,
  patternInvalidErrorMessage,
  type,
  ...props
}) => {
  const { currentValue, error, registerField } = useField(alias)
  helpText = helpText || 'Please select a value'

  const node = React.useRef(null)
  const [currValue, setCurrValue] = React.useState('')


  React.useEffect(() => {
    if (node) {
      node.current.setAttribute("value", currValue);
      node.current.dispatchEvent(new Event("change", { bubbles: true }));

      registerField({
        name: alias,
        ref: node.current,
        validate: value => {
        const errors: string[] = []

        if (
          value &&
          pattern &&
          typeof value === 'string' &&
          !value.match(pattern)
          ) {
            errors.push(
              patternInvalidErrorMessage ||
              `Please match the requested format: ${pattern}`,
              )
            }

            return errors
          },
        })
      }
  }, [currValue])



  const [isOpen, setIsOpen] = React.useState(false)

  const handleOptionsList = (list: object | []) => {
    if (list instanceof Array) {
      return list.map((item: string) => ({
        label: item,
        value: item,
      }))
    }
    return Object.values(list).map((item: string) => ({
      label: item,
      value: item,
    }))
  }

  const handleSelectChange = (value: SingleValue<KeyValue>) => {
    if (typeof preValues === 'object' && Array.isArray(preValues) === false) {
      setCurrValue(Object.values(preValues).indexOf(value))
    } else setCurrValue(value)
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
      <input
        type={type}
        name={alias}
        id={alias}
        ref={node}
        required={required}
        defaultValue={currValue}
        pattern={pattern}
        style={{ visibility: 'hidden', height: 0, width: 0, position: 'absolute', zIndex: -1 }}
      />
        <Select
          placeholder={helpText}
          classNamePrefix="dropdown"
          onMenuOpen={() => setIsOpen(true)}
          onMenuClose={() => setIsOpen(false)}
          onChange={(value: SingleValue<{ label: string; value: string }>) => {
            handleSelectChange(value?.label)
          }}
          options={handleOptionsList(preValues)}
        />
        {error && <span>{error}</span>}
      </div>
    </FieldGroup>
  )
}

FormSelecSelect.displayName = 'Select'

export default FormSelecSelect
