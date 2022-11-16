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
  const [currValue, setCurrValue] = React.useState('')
  const [el, setEl] = React.useState(null)

  const node = React.useRef(null)


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



  React.useEffect(() => {
    if (type === 'hidden') {
      const element = document.getElementById(alias.replace('Label', ''))
      if (element) {
        setEl(element)
        setCurrValue(element.ariaLabel)
      }
    }

  }, [el?.ariaLabel])


  return (
    <>
      <input
        type={type}
        name={alias}
        id={alias}
        ref={node}
        defaultValue={currentValue as string}
        placeholder={placeholder}
        pattern={pattern}
        required={required}
      />
      {error && <span>{error}</span>}
    </>
  )
}

Input.displayName = 'Input'

export default Input
