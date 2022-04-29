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
} from '@chakra-ui/react'
import { SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { FcMindMap } from 'react-icons/fc'
import { useMutation } from 'react-query'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { PasswordInput } from '@/components/Forms/PasswordInput/PasswordInput'
import { Meta } from '@/components/Meta'
import { useLocation } from '@/hooks/useLocation'
import { appwrite } from '@/services/appwrite'
import { Models } from 'appwrite'

interface SigninFormState {
  email: string
  password: string
}

export const Signin = () => {
  const navigate = useNavigate()
  const location = useLocation<Partial<Models.User<Models.Preferences>>>()
  const { control, register, handleSubmit } = useForm<SigninFormState>({
    defaultValues: {
      email: location.state?.email ?? '',
      password: '',
    },
  })
  const { mutateAsync, isLoading } = useMutation(
    (values: SigninFormState) => {
      return appwrite.account.createSession(values.email, values.password)
    },
    { onSuccess: () => navigate('/~') },
  )
  const onSubmit = useCallback<SubmitHandler<SigninFormState>>((values) => mutateAsync(values), [mutateAsync])

  const email = useWatch({ control, name: 'email' })

  return (
    <Box minW="100vw" minH="100vh" bg="gray.100">
      <Meta title="Sign in" />

      <Container maxW="md" py={{ base: 12, md: 24 }}>
        <Stack spacing={8}>
          <Stack spacing="6">
            <Icon mx="auto" as={FcMindMap} fontSize={64} color="blue.500" />
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size="lg">Sign in to your account</Heading>
              <HStack spacing="1" justify="center">
                <Text>Don&apos;t have an account?</Text>
                <Text fontWeight="semibold">
                  <Link as={RouterLink} color="blue.500" to="/sign-up">
                    Sign up
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
              <Stack spacing={6}>
                {/* <IconButton
                  variant="outline"
                  aria-label="Sign in with GitHub"
                  size="lg"
                  onClick={() => appwrite.account.createOAuth2Session('github')}
                >
                  <Icon as={SiGithub} fontSize={24} />
                </IconButton>
                <HStack>
                  <Divider />
                  <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                    or continue with
                  </Text>
                  <Divider />
                </HStack> */}
                <Stack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel htmlFor="email" fontSize="sm">
                      Email
                    </FormLabel>
                    <Input id="email" type="email" {...(register('email'), { required: true })} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="password" fontSize="sm">
                      Password
                    </FormLabel>
                    <PasswordInput {...register('password')} />
                  </FormControl>
                </Stack>
                <Stack spacing={3}>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    Sign in
                  </Button>
                  <Text textAlign="center" fontSize="sm">
                    <Link as={RouterLink} color="blue.500" to="/forgot-password" state={{ email }}>
                      Forgot password?
                    </Link>
                  </Text>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
