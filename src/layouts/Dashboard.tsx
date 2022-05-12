import { ReactNode } from 'react'
import { As, Box, Button, Flex, HStack, Icon, Link, Stack, Text } from '@chakra-ui/react'
import { FcMindMap } from 'react-icons/fc'
import { HiOutlineHome, HiOutlineLogout, HiOutlineUserCircle, HiOutlineUserGroup } from 'react-icons/hi'
import { RiMindMap } from 'react-icons/ri'
import { useQuery } from 'react-query'
import { Outlet, Link as RouterLink, useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import { UserProfile } from '@/components/User/Profile'
import { getAccount, listTeams } from '@/services/api'

interface NavItemProps {
  icon: As
  label: string | ReactNode
  href: string
  end?: boolean
}

const ActiveUserProfile = () => {
  const { data } = useQuery(['account'], getAccount)

  if (!data) return <></>

  return <UserProfile name={data.name} image={data.prefs.gravatar} email={data.email} />
}

const Workspaces = () => {
  const accountQuery = useQuery(['account'], getAccount)
  const teamsQuery = useQuery(['teams'], listTeams)

  return (
    <Stack spacing={1}>
      <Text as="div" fontSize="xs" color="gray.500" fontWeight="bold" p={2}>
        Workspaces
      </Text>
      {accountQuery.isSuccess && (
        <NavItem
          label={
            <>
              {accountQuery.data.name}{' '}
              <Text as="span" fontSize="xs" color="gray.500">
                (PRIVATE)
              </Text>
            </>
          }
          icon={RiMindMap}
          href={`/~/profile/${accountQuery.data.$id}`}
        />
      )}
      {teamsQuery.isSuccess &&
        teamsQuery.data.teams.map((team) => (
          <NavItem
            key={team.$id}
            label={
              <>
                {team.name}{' '}
                <Text as="span" fontSize="xs" color="gray.500">
                  (TEAM)
                </Text>
              </>
            }
            icon={RiMindMap}
            href={`/~/teams/${team.$id}`}
          />
        ))}
    </Stack>
  )
}

const SignOut = () => {
  const navigate = useNavigate()

  return (
    <Button variant="ghost" justifyContent="start" onClick={() => navigate('/sign-out')}>
      <HStack spacing={3}>
        <Icon as={HiOutlineLogout} boxSize={6} color="gray.500" />
        <Text>Sign out</Text>
      </HStack>
    </Button>
  )
}

export const NavItem = ({ icon, label, href, end = false }: NavItemProps) => {
  const resolved = useResolvedPath(href)
  const match = useMatch({ path: resolved.pathname, end })

  return (
    <Link
      justifyContent="start"
      fontWeight="semibold"
      as={RouterLink}
      to={href}
      color="gray.700"
      bgColor={match ? 'gray.200' : 'transparent'}
      _hover={{ color: match ? 'gray.900' : 'gray.700', bgColor: match ? 'gray.200' : 'white' }}
      borderRadius={6}
      px={3}
      py={2}
    >
      <HStack spacing={3}>
        <Icon as={icon} boxSize={5} color="gray.500" />
        <Text as="div" fontSize="sm">
          {label}
        </Text>
      </HStack>
    </Link>
  )
}

export const DashboardLayout = () => (
  <Flex as="section" minH="100vh">
    <Flex
      flex={1}
      bg="gray.50"
      color="gray.700"
      borderRight="1px"
      borderColor="gray.200"
      minW={320}
      maxW={320}
      py={7}
      px={5}
    >
      <Stack w="full" justify="space-between" spacing={1}>
        <Stack spacing={{ base: 5, sm: 8 }}>
          <Link as={RouterLink} to="/~" _hover={{ underline: 'none' }}>
            <HStack spacing={4}>
              <Icon as={FcMindMap} fontSize={36} />
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
          <ActiveUserProfile />
          <Stack spacing={1}>
            <NavItem label="My Dashboard" icon={HiOutlineHome} href="/~" end />
            <NavItem label="My Profile" icon={HiOutlineUserCircle} href="/~/profile" end />
            <NavItem label="My Teams" icon={HiOutlineUserGroup} href="/~/teams" end />
          </Stack>
          <Workspaces />
        </Stack>
        <Stack spacing={{ base: 5, sm: 6 }}>
          <SignOut />
        </Stack>
      </Stack>
    </Flex>
    <Box flex="auto" bg="white">
      <Outlet />
    </Box>
  </Flex>
)
