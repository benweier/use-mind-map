import { useCallback } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { createTeam } from '@/services/api'
import { MindMapCollectionID } from '@/services/appwrite'

interface CreateTeamFormState {
  name: string
  collection: MindMapCollectionID
}

export const CreateTeam = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit } = useForm<CreateTeamFormState>({
    defaultValues: {
      name: '',
    },
  })
  const { mutateAsync, isLoading } = useMutation((values: CreateTeamFormState) => createTeam(values.name), {
    onSuccess: (response) => {
      queryClient.invalidateQueries(['teams'])
      navigate(`/~/teams/${response.$id}`)
    },
  })
  const onSubmit = useCallback<SubmitHandler<CreateTeamFormState>>((values) => mutateAsync(values), [mutateAsync])

  return (
    <>
      <Button variant="ghost" size="sm" colorScheme="blue" onClick={onOpen}>
        Create a Team
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading}>
              <ModalHeader>Create a Team</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={6}>
                  <Stack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel htmlFor="name" fontSize="sm">
                        Name
                      </FormLabel>
                      <Input type="text" {...register('name')} autoFocus />
                    </FormControl>
                  </Stack>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" variant="primary">
                  Create Team
                </Button>
              </ModalFooter>
            </fieldset>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
