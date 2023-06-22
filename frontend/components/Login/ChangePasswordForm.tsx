import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from '@chakra-ui/react';

import { api } from '@/config';
import { client } from '@/services';
import { ErrorResponse } from '@/typing';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
interface IChangePasswordProps {
  email: string;
  code: string;
}
interface ChangePasswordForm {
  email: string;
  code: string;
  new_password: string;
  confirm_password: string;
}
const validationSchema = yup.object().shape({
  new_password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password'), ''], 'Passwords must match')
    .required('Confirm password is required'),
});
const ChangePasswordForm: React.FunctionComponent<IChangePasswordProps> = ({
  email,
  code,
}) => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email,
      code,
      new_password: '',
      confirm_password: '',
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingChange,
  } = useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      const res = await client.post(api.auths + '/reset-password', data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      setIsSuccess(true);
      reset();
    },
  });
  const onSubmit = (data: ChangePasswordForm) => mutate(data);

  return (
    <div className="w-3/4 max-w-[330px]">
      {isSuccess ? (
        <div className="flex flex-col gap-4">
          <Alert status="success" className="items-center">
            <AlertIcon />
            <Flex className="flex-wrap">
              <AlertTitle className="shrink-0">
                Change password success!
              </AlertTitle>
              <AlertDescription className=""></AlertDescription>
            </Flex>
          </Alert>

          <Link href="/" className="text-blue-500 transition-all">
            Back to login page
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <Alert status="error" className="items-center">
              <AlertIcon />
              <Flex className="flex-wrap">
                <AlertTitle className="shrink-0">
                  Change password failed!
                </AlertTitle>
                <AlertDescription className="">
                  {error?.response?.data.error.message}
                </AlertDescription>
              </Flex>
            </Alert>
          )}

          <Text className="text-center">
            Enter a new password for account:{' '}
            <span className="font-semibold">{email}</span>
          </Text>

          <FormControl isInvalid={!!errors.new_password}>
            <Input
              type="password"
              {...register('new_password')}
              placeholder="New password"
            />
            <FormErrorMessage>{errors.new_password?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.confirm_password}>
            <Input
              type="password"
              {...register('confirm_password')}
              placeholder="Confirm password"
            />
            <FormErrorMessage>
              {errors.confirm_password?.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            isLoading={isLoadingChange}
            colorScheme="blue"
            type="submit"
            mb={2}
          >
            Submit
          </Button>
          <Link href="/" className="text-blue-500 transition-all">
            Back to login page
          </Link>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordForm;
