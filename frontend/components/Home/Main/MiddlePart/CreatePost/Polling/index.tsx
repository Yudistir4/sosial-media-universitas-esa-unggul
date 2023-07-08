/* eslint-disable react/no-children-prop */
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';

import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { ErrorResponse, Response, User, UserLittle2 } from '@/typing';

import { useAuth } from '@/store/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { BsFillCameraFill } from 'react-icons/bs';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';
import * as yup from 'yup';
import SelectVoters from './SelectVoters';
interface IPollingFormProps {
  onClose: () => void;
}
interface Option {
  text: string;
  image: File | null;
}

interface CreatePollingForm {
  is_public: boolean;
  title: string;
  use_image: boolean;
  end_date: Date | string;
  options: Option[];
}

const validationSchema = yup.object<CreatePollingForm>().shape({
  is_public: yup.boolean().required(),
  title: yup.string().required().max(100),
  end_date: yup
    .date()
    .required('End date is required')
    .min(
      moment().add(30, 'minutes'),
      'End date should be at least 30 minutes from now'
    )
    .max(
      moment().add(30, 'days'),
      'End date should be within 30 days from now'
    ),
  use_image: yup.boolean().required(),
  options: yup.array().of(
    yup.object().shape({
      text: yup
        .string()
        .required('Option is required')
        .max(50, 'options must be at most 50 characters'),
      image: yup.mixed().when('use_image', {
        is: true,
        then: (schema) => schema.required('WOI'),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
  ),
});
const SUPPORTED_IMAGE_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];
const PollingForm: React.FunctionComponent<IPollingFormProps> = ({
  onClose,
}) => {
  const [requiredImageActive, setRequiredImageActive] = React.useState(false);
  const [totalOptions, setTotalOptions] = React.useState(2);
  const [search, setSearch] = React.useState('');
  const [images, setImages] = React.useState<any>({});
  const loggedInUser = useAuth((state) => state.user);
  const [everyone, setEveryone] = React.useState(true);
  const [selectedUsers, setSelectedUsers] = React.useState<UserLittle2[]>([]);
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePollingForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      is_public: true,
      use_image: true,
      title: '',
      end_date: moment().add(1, 'days').format('YYYY-MM-DDTHH:mm'),
      options: [
        { text: '', image: null },
        { text: '', image: null },
      ],
    },
  });
  console.log(errors.options?.[0]);
  // 2018-06-12T19:30
  const { data, refetch } = useQuery<Response<[User]>, AxiosError<Response>>({
    queryKey: ['users-search', search],
    queryFn: async () => {
      const res = await client.get(
        `${api.users}${convertToQueryStr({
          query: search,
          limit: 5,
        })}`
      );
      return res.data;
    },
    enabled: false,
  });
  React.useEffect(() => {
    if (!search) return;
    const timeout = setTimeout(() => refetch(), 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, refetch]);

  const {
    mutate,
    error,
    isLoading: isLoadingCreate,
  } = useMutation({
    mutationFn: async (data: CreatePollingForm) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('is_public', `${everyone}`);
      if (!everyone) {
        selectedUsers.forEach((user) => {
          formData.append('voters[]', user.id);
        });
      }
      formData.append('use_image', `${data.use_image}`);
      formData.append('end_date', new Date(data.end_date).toISOString());

      formData.append('total_options', data.options.length.toString());

      for (let i = 0; i < data.options.length; i++) {
        formData.append(`options[${i}].text`, data.options[i].text);
        if (data.use_image) {
          formData.append(`options[${i}].image`, data.options[i].image as File);
        }
      }

      const res = await client.post(api.pollings, formData);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pollings', 'polling'] });
      queryClient.invalidateQueries({ queryKey: ['pollings'] });
      toast({
        title: 'Create polling success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });
  const use_image = watch('use_image');

  const onSubmit = (data: CreatePollingForm) => {
    if (data.use_image) {
      for (let i = 0; i < data.options.length; i++) {
        if (data.options[i].image === null) {
          setRequiredImageActive(true);
          return;
        }
      }
      setRequiredImageActive(false);
    }

    mutate(data);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!SUPPORTED_IMAGE_FORMATS.includes(file?.type)) return;

    if (file) {
      setValue(`options.${index}.image`, file);
      setImages((prev: any) => ({ ...prev, [`image${index}`]: file }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <SelectVoters
        everyone={everyone}
        setEveryone={setEveryone}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />

      {error && (
        <Alert status="error" className="items-center">
          <AlertIcon />
          <Flex className="flex-wrap">
            <AlertTitle className="shrink-0">Create polling failed!</AlertTitle>
            <AlertDescription className="shrink-0">
              {error?.response?.data.error.message}
            </AlertDescription>
          </Flex>
        </Alert>
      )}
      <FormControl isInvalid={!!errors.title}>
        <InputGroup size="sm">
          <InputLeftAddon children="Title" />
          <Input {...register('title')} placeholder="title..." />
        </InputGroup>
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.end_date}>
        <InputGroup size="sm">
          <InputLeftAddon children="End date" />
          <Input
            {...register('end_date')}
            placeholder="Select Date and Time"
            type="datetime-local"
          />
        </InputGroup>
        <FormErrorMessage>{errors.end_date?.message}</FormErrorMessage>
      </FormControl>
      <Checkbox {...register('use_image')}>Use Image</Checkbox>

      {Array.from({ length: totalOptions }, (_, index) => index).map(
        (option, i) => (
          <div key={i}>
            <Flex className="bg-gray-200  rounded-xl overflow-hidden">
              <Flex className="gap-2 p-2 flex-1">
                <FormControl isInvalid={!!errors.options?.[i]?.text}>
                  <Textarea
                    rows={use_image ? 2 : 1}
                    {...register(`options.${i}.text`)}
                    placeholder={`Option  ${i + 1}`}
                  />
                </FormControl>
                {use_image &&
                  (images[`image${i}`] ? (
                    <div className="relative shrink-0">
                      <Image
                        h={'60px'}
                        w={'60px'}
                        src={URL.createObjectURL(images[`image${i}`])}
                        className="object-cover rounded-lg"
                        alt="img"
                      />
                      <IconButton
                        onClick={() => {
                          setValue(`options.${i}.image`, null);
                          setImages((prev: any) => ({
                            ...prev,
                            [`image${i}`]: null,
                          }));
                        }}
                        borderRadius="full"
                        size="sm"
                        colorScheme="red"
                        position="absolute"
                        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        aria-label="input file"
                        icon={<MdOutlineDelete className="text-md" />}
                      />
                    </div>
                  ) : (
                    <IconButton
                      h={'60px'}
                      w={'60px'}
                      as="label"
                      colorScheme={'blue'}
                      htmlFor={'file' + i}
                      className={`cursor-pointer shrink-0 ${
                        requiredImageActive && 'border-2 border-red-500'
                      }`}
                      aria-label="input file"
                      icon={<BsFillCameraFill className="text-xl" />}
                    />
                  ))}

                <input
                  className="hidden"
                  type="file"
                  {...register(`options.${i}.image`)}
                  onChange={(e) => handleFileChange(e, i)}
                  id={'file' + i}
                />
              </Flex>
              {totalOptions > 2 && (
                <IconButton
                  onClick={() => {
                    setValue(
                      'options',
                      watch('options')
                        .slice(0, i)
                        .concat(watch('options').slice(i + 1))
                    );
                    setTotalOptions((prev) => prev - 1);
                    setImages((prev: any) => {
                      const newImages = { ...prev };
                      delete newImages[`image${i}`];
                      return newImages;
                    });
                  }}
                  h={use_image ? '77px' : '55px'}
                  borderRadius="0"
                  colorScheme="red"
                  className=""
                  aria-label="input file"
                  icon={<MdOutlineDelete className="text-xl" />}
                />
              )}
            </Flex>
            <Text fontSize="sm" color="red" className="ml-2">
              {errors.options?.[i]?.text?.message}
            </Text>
          </div>
        )
      )}

      {totalOptions < 5 && (
        <Button
          onClick={() => {
            setTotalOptions((prev) => prev + 1);
            setValue('options', [
              ...watch('options'),
              { text: '', image: null },
            ]);
          }}
          leftIcon={<IoMdAdd className="text-xl" />}
        >
          Add Option
        </Button>
      )}
      <Button
        isLoading={isLoadingCreate}
        colorScheme="blue"
        type="submit"
        mb={2}
      >
        Submit
      </Button>
    </form>
  );
};

export default PollingForm;
