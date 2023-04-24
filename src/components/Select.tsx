import React from 'react';
import ReactSelect from 'react-select';
import SelectType from 'react-select/dist/declarations/src/Select';

export const Select = React.forwardRef<
  React.ElementRef<typeof SelectType>,
  React.ComponentProps<typeof ReactSelect>
>(({ ...props }, forwardedRef) => {
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
          fontSize: 'var(--fontSizes-2)',
          marginLeft: '4px',
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          color: 'var(--colors-text-primary)',
          marginLeft: '4px',
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
});

Select.displayName = 'Select';
