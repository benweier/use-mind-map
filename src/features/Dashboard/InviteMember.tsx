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
  useToast,
} from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { inviteTeamMember } from '@/services/api'

interface InviteMemberFormState {
  name: string
  email: string
  team: string
}

export const InviteMember = ({ id }: { id: string }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { register, handleSubmit } = useForm<InviteMemberFormState>({
    defaultValues: {
      email: '',
      team: id,
    },
  })
  const { mutateAsync, isLoading } = useMutation(
    (values: InviteMemberFormState) => inviteTeamMember(values.team, values.email, values.name),
    {
      onSuccess: (response) => {
        toast({
          title: 'Invite sent!',
          description: `${response.name} has been invited to the team`,
          status: 'success',
          position: 'bottom',
        })
        onClose()
      },
    },
  )
  const onSubmit = useCallback<SubmitHandler<InviteMemberFormState>>((values) => mutateAsync(values), [mutateAsync])

  return (
    <>
      <Button variant="ghost" size="sm" colorScheme="blue" onClick={onOpen}>
        Invite Team Member
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading}>
              <ModalHeader>Invite Team Member</ModalHeader>
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
                    <FormControl isRequired>
                      <FormLabel htmlFor="email" fontSize="sm">
                        Email
                      </FormLabel>
                      <Input type="email" {...register('email')} />
                    </FormControl>
                  </Stack>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" variant="primary">
                  Invite Member
                </Button>
              </ModalFooter>
            </fieldset>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
