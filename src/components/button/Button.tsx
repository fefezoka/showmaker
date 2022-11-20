import React, { forwardRef } from 'react';
import { Button as StyledButton } from './style';
import Spinner from '../../assets/Spinner.svg';
import Image from 'next/image';
import { IconType } from 'react-icons/lib';

interface Props extends React.ComponentProps<typeof StyledButton> {
  value?: string;
  loading?: boolean;
  Icon?: IconType;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ value, Icon, loading, ...props }: Props, ref) => {
    return (
      <StyledButton {...props} ref={ref}>
        {loading && <Image src={Spinner} height={18} width={18} alt="" />}
        {Icon && <Icon size={18} />}
        {!loading && !Icon && value}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
