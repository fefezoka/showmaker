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
          control: (baseStyles) => ({
            ...baseStyles,
            fontSize: '14px',
          }),
          container: (baseStyles) => ({
            ...baseStyles,
            fontSize: '14px',
          }),
        }}
      />
    );
  }
);

Select.displayName = 'Select';
