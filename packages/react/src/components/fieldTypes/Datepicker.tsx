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

  const datesCompare = (date) => {
    const currDate = new Date();

    const curr = Date.UTC(
      currDate.getFullYear(),
      currDate.getMonth() + 1,
      currDate.getDate(),
    );

    const compared = Date.UTC(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    );

    const currMonth = Date.UTC(
      currDate.getFullYear(),
      currDate.getMonth() + 1,
    )
    const comparedMonth = Date.UTC(
      date.getFullYear(),
      date.getMonth() + 1,
    )

    if (currMonth < comparedMonth) return 2;
    if (currMonth > comparedMonth) return -2;
    if (+curr < +compared) return 1;
    if (+curr === +compared) return 0;
    if (+curr > +compared) return -1;
    return null;
  };

  const getDateText = (date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    return `${day}/${month}/${year}`;
  };

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [placeholderText, setPlaceholderText] = React.useState(placeholder);
  const [isOpen, setIsOpen] = React.useState(false);

  const settings = {
    placeholderText,
    useWeekdaysShort: true,
    className: 'react-datepicker__input',
    isOpen,
    fixedHeight: true,
    openToDate: selectedDate,
    onCalendarOpen: () => setIsOpen(true),
    onCalendarClose: () => {
      setIsOpen(false);
      setPlaceholderText(getDateText(selectedDate));
    },
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

  const node = React.useRef(null)

  React.useEffect(() => {
    if (node) {
      node.current.setAttribute("value", placeholderText);
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
  }, [placeholderText])

  return (
    <>
          <input
        type="text"
        name={alias}
        id={alias}
        ref={node}
        defaultValue={placeholderText}
        placeholder={placeholder}
        pattern={pattern}
        required={required}
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
