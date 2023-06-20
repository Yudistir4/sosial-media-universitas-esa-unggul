import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';

import { api } from '@/config';
import { client } from '@/services';
import { ErrorResponse } from '@/typing';

import { useAuth } from '@/store/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
interface IVerificationCodeFormProps {
  closeCodeForm: () => void;

  new_email: string;
}
const validationSchema = yup.object().shape({
  verification_code: yup.string().required('Verification code is required'),
});
interface VerifyCodeForm {
  new_email: string;
  verification_code: string;
}
const VerificationCodeForm: React.FunctionComponent<
  IVerificationCodeFormProps
> = ({ closeCodeForm, new_email }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<VerifyCodeForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      new_email,
      verification_code: '',
    },
  });
  const queryClient = useQueryClient();
  const toast = useToast();
  const setEmail = useAuth((state) => state.setEmail);
  const user = useAuth((state) => state.user);
  const {
    mutate,
    error,
    isLoading: isLoadingChange,
  } = useMutation({
    mutationFn: async (data: VerifyCodeForm) => {
      const res = await client.post(api.auths + '/verify-email', data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      setEmail(new_email);
      toast({
        title: 'Change email success',
        status: 'success',
        duration: 9000,
      });
      queryClient.invalidateQueries({ queryKey: [user?.id] });
      closeCodeForm();
    },
  });
  const onSubmit = (data: VerifyCodeForm) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {error && (
        <Alert status="error" className="items-center">
          <AlertIcon />
          <Flex className="flex-wrap">
            <AlertTitle className="shrink-0">Verify email failed!</AlertTitle>
            <AlertDescription className="">
              {error?.response?.data.error.message}
            </AlertDescription>
          </Flex>
        </Alert>
      )}
      {!error && (
        <Alert status="success">
          <Flex>
            <AlertDescription className="text-center">
              We have sent a verification code to your new email. Please check
              your new email.
            </AlertDescription>
          </Flex>
        </Alert>
      )}
      <FormControl isInvalid={!!errors.verification_code}>
        <FormLabel textAlign="center">Verification Code</FormLabel>
        <Input
          {...register('verification_code')}
          placeholder="Verification code"
        />
        <FormErrorMessage justifyContent="center">
          {errors.verification_code?.message}
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
    </form>
  );
};

export default VerificationCodeForm;
