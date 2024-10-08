import React, { useCallback } from 'react'
import ReactDatePicker from 'react-datepicker';

import useField from '../../hooks/useField'

type Props = JSX.IntrinsicElements['input'] & {
  alias: string
  requiredErrorMessage?: string
  patternInvalidErrorMessage?: string
}

const Datepicker: React.FC<Props> = ({
  alias,
  placeholder,
  required,
  pattern,
  patternInvalidErrorMessage,
  type,
}) => {
  const { currentValue, error, registerField } = useField(alias)
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [placeholderText, setPlaceholderText] = React.useState(placeholder)
  const [isOpen, setIsOpen] = React.useState(false)
  const node = React.useRef(null)

  const datesCompare = (date) => {

    const currDate = new Date();
    const curr = +`${currDate.getFullYear()}${currDate.getMonth() + 1}${currDate.getDate()}`
    const compared = +`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
    const currMonth = +`${currDate.getFullYear()}${currDate.getMonth() + 1}`;
    const comparedMonth = +`${date.getFullYear()}${date.getMonth() + 1}`;

    if (currMonth < comparedMonth) return 2;
    if (currMonth > comparedMonth) return -2;
    if (curr < compared) return 1;
    if (curr === compared) return 0;
    if (curr > compared) return -1;
    return null;
  };

  const getDateText = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}/${month}/${year}`;
  };

  const handleDateValue = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const settings = {
    placeholderText,
    useWeekdaysShort: true,
    className: 'react-datepicker__input',
    isOpen,
    fixedHeight: true,
    openToDate: selectedDate,
    onCalendarOpen: () => setIsOpen(true),
    onCalendarClose: () => {
      setIsOpen(false)
      setPlaceholderText(getDateText(selectedDate))
    },
    onSelect: (date) => setSelectedDate(date),
    onChange: (date) => setSelectedDate(date),
    formatWeekDay: (format) => format.slice(0, 2),
    dayClassName: (date) => {
      switch (datesCompare(date)) {
        case -2:
          return 'react-datepicker__day--prev-month';
        case -1:
          return 'react-datepicker__day--prev-day';
        case 0:
          return 'react-datepicker__day--curr-day';
        case 1:
          return 'react-datepicker__day--next-day';
          case 2:
            return 'react-datepicker__day--next-month';
        default:
          return null;
      }
    },
  };

  React.useEffect(() => {
    if (node) {
      node.current.setAttribute("value", handleDateValue(selectedDate))
      node.current.dispatchEvent(new Event("change", { bubbles: true }))

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
  }, [selectedDate])

  return (
    <>
      <input
        type="text"
        name={alias}
        id={alias}
        ref={node}
        required={required}
        defaultValue={currentValue as string}
        pattern={pattern}
        style={{ visibility: 'hidden', height: 0, width: 0, position: 'absolute', zIndex: -1 }}
      />
      <div className="react-datepicker__wrapper">
        <ReactDatePicker
          {...settings}
        />
      </div>
      {error && <span>{error}</span>}
    </>
  )
}

Datepicker.displayName = 'Datepicker'

export default Datepicker
