import React from 'react';
import ReactSelect from 'react-select';
import SelectType from 'react-select/dist/declarations/src/Select';

type SelectProps = React.ComponentProps<typeof ReactSelect>;

export const Select = React.forwardRef<React.ElementRef<typeof SelectType>, SelectProps>(
  ({ ...props }, forwardedRef) => {
    return (
      <ReactSelect
        {...props}
        ref={forwardedRef}
        styles={{
          input: (baseStyles) => ({
            ...baseStyles,
            minHeight: '32px',
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            color: 'var(--colors-text-secondary)',
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            color: 'var(--colors-text-primary)',
            marginLeft: '12px',
          }),
          control: (baseStyles) => ({
            ...baseStyles,
            fontSize: '14px',
            backgroundColor: 'var(--colors-bg-2)',
            boxShadow: 'unset',
            border: 0,
          }),
          container: (baseStyles) => ({
            ...baseStyles,
            fontSize: '14px',
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: 'var(--colors-bg-2)',
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: 'var(--colors-bg-2)',

            ':hover': {
              backgroundColor: 'var(--colors-bg-3)',
            },
          }),
        }}
      />
    );
  }
);

Select.displayName = 'Select';
