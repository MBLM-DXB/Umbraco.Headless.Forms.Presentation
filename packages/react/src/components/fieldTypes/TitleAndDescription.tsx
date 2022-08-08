import React, { useContext } from 'react'

import useTheme from '../../hooks/useTheme'
import ThemeContext from '../../providers/ThemeContext'
import { FieldProps } from '../../types'

type Props = FieldProps & {
  bodyText?: string
}

const TitleAndDescription: React.FC<Props> = ({ caption, bodyText }) => {
  const theme = useContext(ThemeContext)
  const [className, styles] = useTheme(theme, 'fieldGroup')

  return (
    <div className={className} style={styles}>
      {caption && <h1>{caption}</h1>}
      {bodyText && <p dangerouslySetInnerHTML={{ __html: bodyText }}/>}
    </div>
  )
}

TitleAndDescription.displayName = 'TitleAndDescription'

export default TitleAndDescription
