import React from 'react';
import { Controller, Control } from 'react-hook-form';
import ReactSelect from 'react-select';

interface Props {
  control: Control;
  name: string;
}

export const Select = ({
  control,
  name,
  ...props
}: Props & React.ComponentProps<ReactSelect>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ReactSelect
          {...props}
          value={field.value}
          ref={field.ref}
          onChange={field.onChange}
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
      )}
    />
  );
};

Select.displayName = 'Select';
