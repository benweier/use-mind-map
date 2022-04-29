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
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { createMindMap } from '@/services/api'
import { MindMapCollectionID } from '@/services/appwrite'

interface CreateMindMapFormState {
  name: string
  collection: MindMapCollectionID
}

export const CreateMindMind = ({ name = '', collection }: { name?: string; collection: MindMapCollectionID }) => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit } = useForm<CreateMindMapFormState>({
    defaultValues: {
      collection,
      name,
    },
  })
  const { mutateAsync, isLoading } = useMutation(
    (values: CreateMindMapFormState) => createMindMap(values.collection, values.name),
    {
      onSuccess: (response) => {
        navigate(`/~/maps/${response.$collection}/${response.$id}`)
      },
    },
  )
  const onSubmit = useCallback<SubmitHandler<CreateMindMapFormState>>((values) => mutateAsync(values), [mutateAsync])

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Create a Mind Map
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading}>
              <ModalHeader>Create a Mind Map</ModalHeader>
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
                  Create Mind Map
                </Button>
              </ModalFooter>
            </fieldset>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
