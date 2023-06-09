import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  Box,
} from '@chakra-ui/react';
interface IForgotPasswordFormProps {
  setShowForgotPassword: (value: boolean) => void;
}
const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

interface Login {
  email: string;
}
const ForgotPasswordForm: React.FunctionComponent<IForgotPasswordFormProps> = ({
  setShowForgotPassword,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<Login>({ resolver: yupResolver(validationSchema) });

  const submit = (data: Login) => {
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="w-3/4 max-w-[330px] flex flex-col gap-4"
    >
      <Text fontSize={{ sm: 'sm', xl: 'medium' }}>
        Enter the email address associated with your account and we&apos;ll send
        you a link to reset your password
      </Text>
      <FormControl isInvalid={!!errors.email}>
        <Input type="text" placeholder="email" {...register('email')} />
        <FormErrorMessage>{errors.email?.message} </FormErrorMessage>
      </FormControl>
      <Button type="submit" colorScheme="blue">
        Continue
      </Button>
      <Text
        onClick={() => setShowForgotPassword(false)}
        fontSize={{ sm: 'sm', xl: 'medium' }}
        color="blue.500"
        mt={5}
        className="cursor-pointer"
      >
        Back to login page
      </Text>
    </form>
  );
};

export default ForgotPasswordForm;
