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
import { SubmitHandler, useForm } from 'react-hook-form'
import { FcMindMap } from 'react-icons/fc'
import { useMutation } from 'react-query'
import { Link as RouterLink } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { env } from '@/config/env.client'
import { useLocation } from '@/hooks/useLocation'
import { appwrite } from '@/services/appwrite'
import type { Models } from 'appwrite'

interface PasswordRecoveryFormState {
  email: string
}

export const PasswordRecovery = () => {
  const location = useLocation<Partial<Models.User<Models.Preferences>>>()
  const { register, handleSubmit } = useForm<PasswordRecoveryFormState>({
    defaultValues: {
      email: location.state?.email ?? '',
    },
  })
  const { mutateAsync, isLoading } = useMutation((values: PasswordRecoveryFormState) => {
    return appwrite.account.createRecovery(values.email, `${env.APP_URL}/reset-password`)
  })
  const onSubmit = useCallback<SubmitHandler<PasswordRecoveryFormState>>((values) => mutateAsync(values), [mutateAsync])

  return (
    <Box minW="100vw" minH="100vh" bg="gray.100">
      <Meta title="Forgot Password" />

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
              <Heading size="lg">Forgot Password</Heading>
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
              <Stack spacing={6}>
                <Stack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel htmlFor="email" fontSize="sm">
                      Email
                    </FormLabel>
                    <Input id="email" type="email" {...register('email')} />
                  </FormControl>
                </Stack>
                <Stack spacing={4}>
                  <Button type="submit" variant="primary" disabled={isLoading}>
                    Reset password
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
