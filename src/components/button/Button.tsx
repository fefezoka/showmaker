import React from 'react';
import { Button as StyledButton } from './style';
import Spinner from '../../assets/Spinner.svg';
import Image from 'next/image';

interface Props extends React.ComponentProps<typeof StyledButton> {
  value: string;
  loading?: boolean;
}

export const Button = ({ value, loading = false, ...props }: Props) => {
  return (
    <StyledButton {...props}>
      {loading ? <Image src={Spinner} height={18} width={18} alt="" /> : value}
    </StyledButton>
  );
};
