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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { client } from '@/services';
import { api } from '@/config';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/typing';
interface IForgotPasswordFormProps {
  setShowForgotPassword: (value: boolean) => void;
}
const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

interface ForgotPassword {
  email: string;
}
const ForgotPasswordForm: React.FunctionComponent<IForgotPasswordFormProps> = ({
  setShowForgotPassword,
}) => {
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<ForgotPassword>({ resolver: yupResolver(validationSchema) });

  const { mutate, error, isLoading } = useMutation({
    mutationFn: async (data: ForgotPassword) => {
      const res = await client.post(api.auths + '/forgot-password', data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      setIsSuccess(true);
      // reset();
    },
  });

  const submit = (data: ForgotPassword) => {
    mutate(data);
  };
  return (
    <div className="w-3/4 max-w-[330px] ">
      {isSuccess ? (
        <div className="flex flex-col gap-4">
          <Alert status="success" className="items-center">
            <AlertIcon />
            <Flex className="flex-wrap">
              <AlertTitle className="shrink-0">
                Send reset password link success!
              </AlertTitle>
              <AlertDescription className="">
                Please check your email!
              </AlertDescription>
            </Flex>
          </Alert>
          <Text
            onClick={() => setShowForgotPassword(false)}
            fontSize={{ sm: 'sm', xl: 'medium' }}
            color="blue.500"
            mt={5}
            className="cursor-pointer"
          >
            Back to login page
          </Text>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(submit)}
          className="w-full flex flex-col gap-4"
        >
          <Text fontSize={{ sm: 'sm', xl: 'medium' }}>
            Enter the email address associated with your account and we&apos;ll
            send you a link to reset your password
          </Text>
          {error && (
            <Alert status="error" className="items-center">
              <AlertIcon />
              <Flex className="flex-wrap">
                <AlertTitle className="shrink-0">
                  Send reset password link failed!
                </AlertTitle>
                <AlertDescription className="">
                  {error?.response?.data.error.message}
                </AlertDescription>
              </Flex>
            </Alert>
          )}

          <FormControl isInvalid={!!errors.email}>
            <Input type="text" placeholder="email" {...register('email')} />
            <FormErrorMessage>{errors.email?.message} </FormErrorMessage>
          </FormControl>
          <Button isLoading={isLoading} type="submit" colorScheme="blue">
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
      )}
    </div>
  );
};

export default ForgotPasswordForm;
