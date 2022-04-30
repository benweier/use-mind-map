import { FC, useCallback } from 'react'
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Stack, useToast } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Meta } from '@/components/Meta'
import { appwrite } from '@/services/appwrite'

interface ProfileFormState {
  name: string
}

export const Profile: FC = () => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const accountQuery = useQuery(['account'], () => appwrite.account.get())
  const { mutateAsync, isLoading } = useMutation(
    (values: ProfileFormState) => appwrite.account.updateName(values.name),
    {
      onSuccess: (response) => {
        queryClient.setQueryData(['account'], response)
        toast({
          title: `Profile updated!`,
          description: `From now on you'll be seen as "${response.name}"`,
          status: 'success',
          position: 'bottom',
        })
      },
    },
  )
  const { register, handleSubmit } = useForm<ProfileFormState>({
    defaultValues: { name: accountQuery.data?.name },
  })
  const onSubmit = useCallback<SubmitHandler<ProfileFormState>>((values) => mutateAsync(values), [mutateAsync])

  return (
    <>
      <Meta title="My Profile" />

      <Container maxW="5xl">
        <Flex p={6} alignItems="center">
          <Heading as="h1" size="lg">
            My Profile
          </Heading>
        </Flex>

        <Box p={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading}>
              <Stack spacing={6}>
                <Stack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel htmlFor="name" fontSize="sm">
                      Name
                    </FormLabel>
                    <Input type="text" {...register('name')} />
                  </FormControl>
                </Stack>
                <Stack spacing={4}>
                  <Button type="submit" variant="primary">
                    Save Profile
                  </Button>
                </Stack>
              </Stack>
            </fieldset>
          </form>
        </Box>
      </Container>
    </>
  )
}
