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

  const months = {
    1: 'january',
    2: 'february',
    3: 'march',
    4: 'april',
    5: 'may',
    6: 'june',
    7: 'july',
    8: 'august',
    9: 'september',
    10: 'october',
    11: 'november',
    12: 'december',
  };

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
  const [placeholderText, setPlaceholderText] = React.useState(getDateText(selectedDate));
  const [isOpen, setIsOpen] = React.useState(false);


  const settings = {
    placeholderText,
    useWeekdaysShort: true,
    className: 'react-datepicker__input',
    isOpen,
    openToDate: selectedDate,
    onCalendarOpen: () => {
      setIsOpen(true);
      setPlaceholderText('select date');
    },
    onCalendarClose: () => {
      setIsOpen(false);
      setPlaceholderText(getDateText(selectedDate));
    },
    onChange: (date) => {
      setSelectedDate(date);
    },
    formatWeekDay: (format) => format.slice(0, 2),
    dayClassName: (date) => {
      switch (datesCompare(date)) {
        case -1:
          return 'react-datepicker__day--prev-day';
        case 0:
          return 'react-datepicker__day--curr-day';
        case 1:
          return 'react-datepicker__day--next-day';
        default:
          return null;
      }
    },
  };

  return (
    <>
      <div className="react-datepicker__wrapper">
        <ReactDatePicker
          {...settings}
          name={alias}
          id={alias}
          ref={ref}
          defaultValue={currentValue as string}
          placeholder={placeholder}
          pattern={pattern}
          required={required}
        />
      </div>
      {error && <span>{error}</span>}
    </>
  )
}

Datepicker.displayName = 'Datepicker'

export default Datepicker
