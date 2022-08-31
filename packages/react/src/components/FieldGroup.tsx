import React, { useContext, useEffect, useState } from 'react'

import useCondition from '../hooks/useCondition'
import useField from '../hooks/useField'
import useTheme from '../hooks/useTheme'
import FormContext from '../providers/FormContext'
import ThemeContext from '../providers/ThemeContext'
import { FormCondition, FormFieldIndicationType } from '../types'

interface Props {
  alias: string
  caption: string
  errors?: object
  helpText?: string
  required?: boolean
  condition?: FormCondition
}

const FieldGroup: React.FC<Props> = ({
  alias,
  caption,
  children,
  required,
  condition,
}) => {
  const theme = useContext(ThemeContext)
  const {
    form: { fieldIndicationType, indicator },
  } = useContext(FormContext)
  const [className, styles] = useTheme(theme, 'fieldGroup')
  const isVisible = useCondition(condition)
  const currValue = useField(alias).currentValue;
  const [hasValue, setHasValue] = useState(false)

  useEffect(() => {
    if (currValue) setHasValue(true)
    else setHasValue(false)
  }, [currValue])

  const showIndicator = () => {
    switch (fieldIndicationType) {
      case FormFieldIndicationType.MarkMandatoryFields:
        return required
      case FormFieldIndicationType.MarkOptionalFields:
        return !required
      default:
        return false
    }
  }
  return (
    <>
      {isVisible && (
        <div className={className} style={styles}>
          <label htmlFor={alias}
          className={hasValue ? 'has-value' : ''}
          >
            {caption}
            {showIndicator() && indicator}
          </label>
          {children}
        </div>
      )}
    </>
  )
}

FieldGroup.displayName = 'FieldGroup'

export default FieldGroup
