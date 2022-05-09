import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react'
import { FcMindMap } from 'react-icons/fc'
import { useMutation } from 'react-query'
import { Navigate, Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { appwrite } from '@/services/appwrite'

const InviteStatus = ({
  membership,
  team,
  user,
  secret,
}: {
  membership: string
  team: string
  user: string
  secret: string
}) => {
  const toast = useToast()
  const navigate = useNavigate()

  const onAccept = useMutation(() => appwrite.teams.updateMembershipStatus(team, membership, user, secret), {
    onSuccess: () => {
      toast({
        title: 'Invite accepted',
        status: 'success',
        position: 'bottom',
      })
      navigate('/~')
    },
  })

  return (
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
          <Heading size="lg">Team Invitation</Heading>
        </Stack>
      </Stack>
      <Box
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={useBreakpointValue({ base: 'transparent', sm: 'white' })}
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <Stack spacing={4}>
          <Text as="div" textAlign="center">
            You have been invited to join a team!
          </Text>
          <Button variant="ghost" onClick={() => onAccept.mutate()}>
            Accept
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export const AcceptInvite = () => {
  const [params] = useSearchParams()

  const membershipId = params.get('membershipId')
  const teamId = params.get('teamId')
  const userId = params.get('userId')
  const secret = params.get('secret')

  if (!membershipId || !teamId || !userId || !secret) return <Navigate to="/" replace />

  return (
    <Box minW="100vw" minH="100vh" bg="gray.100">
      <Meta title="Team Invitation" />

      <Container maxW="md" py={{ base: 12, md: 24 }}>
        <InviteStatus membership={membershipId} team={teamId} user={userId} secret={secret} />
      </Container>
    </Box>
  )
}
