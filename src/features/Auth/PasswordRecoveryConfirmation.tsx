import { useCallback } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  Link,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FcMindMap } from 'react-icons/fc'
import { useMutation } from 'react-query'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { appwrite } from '@/services/appwrite'

interface PasswordRecoveryConfirmationFormState {
  password: string
}

export const PasswordRecoveryConfirmation = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { register, handleSubmit } = useForm<PasswordRecoveryConfirmationFormState>({
    defaultValues: {
      password: '',
    },
  })

  const user = params.get('userId')
  const secret = params.get('secret')

  const { mutateAsync, isLoading } = useMutation(
    ({ values, user, secret }: { values: PasswordRecoveryConfirmationFormState; user: string; secret: string }) => {
      return appwrite.account.updateRecovery(user, secret, values.password, values.password)
    },
    {
      onSuccess: () => {
        toast({
          title: 'Your password has been reset!',
          description: 'Try signing in. I bet it works now',
          status: 'success',
          position: 'bottom',
        })
        navigate('/sign-in')
      },
    },
  )
  const onSubmit = useCallback<SubmitHandler<PasswordRecoveryConfirmationFormState>>(
    (values) => {
      if (!user || !secret) {
        return Promise.reject(new Error('Invalid user or secret'))
      }

      return mutateAsync({ values, user, secret })
    },
    [mutateAsync, user, secret],
  )

  return (
    <Box minW="100vw" minH="100vh" bg="gray.100">
      <Meta title="Reset Password" />

      <Container maxW="md" py={{ base: 12, md: 24 }}>
        <Stack spacing={8}>
          <Stack spacing="6">
            <Link as={RouterLink} to="/" _hover={{ underline: 'none' }}>
              <HStack spacing={4} justify="center">
                <Icon as={FcMindMap} fontSize={64} />
                <Box>
                  <Text
                    as="span"
                    fontSize="sm"
                    fontWeight="black"
                    bgColor="blue.500"
                    color="white"
                    px={1}
                    rounded="base"
                    verticalAlign="text-bottom"
                  >
                    USE
                  </Text>
                  <Text as="span" fontSize="xl" fontWeight="bold">
                    Mindmap
                  </Text>
                </Box>
              </HStack>
            </Link>
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size="lg">Reset Password</Heading>
              <HStack spacing="1" justify="center">
                <Text>Remembered your password?</Text>
                <Text fontWeight="semibold">
                  <Link as={RouterLink} to="/sign-in">
                    Sign in
                  </Link>
                </Text>
              </HStack>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={useBreakpointValue({ base: 'transparent', sm: 'white' })}
            boxShadow={{ base: 'none', sm: 'md' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset disabled={!user || !secret}>
                <Stack spacing={6}>
                  <Stack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel htmlFor="password" fontSize="sm">
                        New Password
                      </FormLabel>
                      <Input id="password" type="password" {...register('password')} />
                    </FormControl>
                  </Stack>
                  <Stack spacing={4}>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                      Reset password
                    </Button>
                  </Stack>
                </Stack>
              </fieldset>
            </form>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
