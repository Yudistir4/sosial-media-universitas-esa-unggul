import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError } from 'axios';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  Box,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/store/user';
import { ErrorResponse, LoginResponse, User } from '@/typing';
import { client } from '@/services';
import { api, config } from '@/config';
interface ILoginFormProps {
  setShowForgotPassword: (value: boolean) => void;
}
const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

interface Login {
  email: string;
  password: string;
}
const LoginForm: React.FunctionComponent<ILoginFormProps> = ({
  setShowForgotPassword,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<Login>({ resolver: yupResolver(validationSchema) });

  const login = useAuth((state) => state.login);

  const { mutate, error, isLoading } = useMutation<
    LoginResponse,
    AxiosError<ErrorResponse>,
    Login
  >({
    mutationFn: async (data) => {
      const res = await client.post(api.auths + '/login', data);
      return res.data;
    },
    onSuccess: (res) => {
      login(res.data);
    },
    onError: (res) => res.response?.data.error.message,
  });
  const submit = (data: Login) => {
    console.log(data);
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="w-3/4 max-w-[330px] flex flex-col gap-4"
    >
      <Text fontSize={{ sm: 'xl', lg: '2xl' }} as="b">
        Login to your account
      </Text>
      {error && (
        <Text color="red.500">{error?.response?.data.error.message}</Text>
      )}
      <FormControl isInvalid={!!errors.email}>
        <Input type="text" placeholder="email" {...register('email')} />
        <FormErrorMessage>{errors.email?.message} </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.password}>
        <Input
          type="password"
          placeholder="password"
          {...register('password')}
        />
        <FormErrorMessage>{errors.password?.message} </FormErrorMessage>
      </FormControl>
      <Button type="submit" colorScheme="blue" isLoading={isLoading}>
        Log In
      </Button>
      <Text
        onClick={() => setShowForgotPassword(true)}
        fontSize={{ sm: 'xs', md: 'sm', xl: 'medium' }}
        color="blue.500"
        mt={5}
        className="cursor-pointer"
      >
        Forgot password?
      </Text>
      <Text fontSize={{ sm: 'xs', md: 'sm', xl: 'medium' }}>
        Don&apos;t have an account yet? Please contact the <a href="">admin</a>{' '}
        to create account for you.
      </Text>
    </form>
  );
};

export default LoginForm;
