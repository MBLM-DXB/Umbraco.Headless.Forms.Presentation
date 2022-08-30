import React, { useCallback } from 'react'

import useField from '../../hooks/useField'

type Props = JSX.IntrinsicElements['input'] & {
  alias: string
  requiredErrorMessage?: string
  patternInvalidErrorMessage?: string
}

const Input: React.FC<Props> = ({
  alias,
  placeholder,
  required,
  pattern,
  patternInvalidErrorMessage,
  type,
}) => {
  const { currentValue, error, registerField } = useField(alias)

  const ref = useCallback(
    node => {
      registerField({
        name: alias,
        ref: node,
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
    },
    [alias, pattern, patternInvalidErrorMessage, registerField],
  )

  return (
    <>
      <input
        type={type}
        name={alias}
        id={alias}
        ref={ref}
        defaultValue={currentValue as string}
        placeholder={placeholder}
        pattern={pattern}
        required={required}
        className={currentValue ? 'has-value' : ''}
      />
      {error && <span>{error}</span>}
    </>
  )
}

Input.displayName = 'Input'

export default Input
