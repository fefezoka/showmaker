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
              color: 'var(--colors-slate11)',
              fontSize: 'var(--fontSizes-2)',
              marginLeft: '4px',
              fontWeight: 500,
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              color: 'var(--colors-slate12)',
              marginLeft: '4px',
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              fontSize: '14px',
              backgroundColor: 'var(--colors-bg2)',
              boxShadow: 'inset 0 0 0 1px var(--colors-bg3)',
              border: 0,
              borderRadius: '4px',
            }),
            container: (baseStyles) => ({
              ...baseStyles,
              fontSize: '14px',
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: 'var(--colors-bg2)',
            }),
            option: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: 'var(--colors-bg2)',

              ':hover': {
                backgroundColor: 'var(--colors-bg3)',
              },
            }),
          }}
        />
      )}
    />
  );
};

Select.displayName = 'Select';
