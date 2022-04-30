import { useCallback } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Icon,
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
import { HiPlusCircle } from 'react-icons/hi'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { createMindMap } from '@/services/api'
import { MindMapCollectionID } from '@/services/appwrite'

interface CreateMindMapFormState {
  name: string
  workspace: MindMapCollectionID
}

export const CreateMindMind = ({ name = '', workspace }: { name?: string; workspace: MindMapCollectionID }) => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit } = useForm<CreateMindMapFormState>({
    defaultValues: {
      workspace,
      name,
    },
  })
  const { mutateAsync, isLoading } = useMutation(
    (values: CreateMindMapFormState) => createMindMap(values.workspace, values.name),
    {
      onSuccess: (response) => {
        navigate(`/~/maps/${response.$collection}/${response.$id}`)
      },
    },
  )
  const onSubmit = useCallback<SubmitHandler<CreateMindMapFormState>>((values) => mutateAsync(values), [mutateAsync])

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen} leftIcon={<Icon as={HiPlusCircle} />}>
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
                      <Input type="text" {...register('name', { required: true })} autoFocus />
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
