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
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { PasswordInput } from '@/components/Forms/PasswordInput/PasswordInput'
import { Meta } from '@/components/Meta'
import { appwrite } from '@/services/appwrite'

interface SignupFormState {
  name: string
  email: string
  password: string
}

export const Signup = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<SignupFormState>()
  const { mutateAsync, isLoading } = useMutation(
    (values: SignupFormState) => {
      return appwrite.account.create('unique()', values.email, values.password, values.name)
    },
    {
      onSuccess: (response) => {
        toast({
          title: `Hi, ${response.name}!`,
          description: 'Your account has been created.',
          status: 'success',
          position: 'bottom',
        })
        navigate('/sign-in', {
          state: response,
        })
      },
    },
  )
  const onSubmit = useCallback<SubmitHandler<SignupFormState>>((values) => mutateAsync(values), [mutateAsync])

  return (
    <Box minW="100vw" minH="100vh" bg={useBreakpointValue({ base: 'white', sm: 'gray.100' })}>
      <Meta title="Sign up" />

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
              <Heading size="lg">Create an Account</Heading>
              <HStack spacing="1" justify="center">
                <Text>Already have an account?</Text>
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
                    <FormLabel htmlFor="name" fontSize="sm">
                      Name
                    </FormLabel>
                    <Input id="name" type="name" {...register('name', { required: true })} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="email" fontSize="sm">
                      Email
                    </FormLabel>
                    <Input id="email" type="email" {...register('email', { required: true })} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel htmlFor="password" fontSize="sm">
                      Password
                    </FormLabel>
                    <PasswordInput {...register('password')} />
                  </FormControl>
                </Stack>
                <Stack spacing={4}>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    Sign up
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
