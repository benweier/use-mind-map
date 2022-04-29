import { FC } from 'react'
import { Avatar, Box, Button, Flex, Heading } from '@chakra-ui/react'
import { HiPencilAlt } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { appwrite } from '@/services/appwrite'
import { Models } from 'appwrite'
import { Content } from './Content'

export const UserCard: FC<Models.User<Models.Preferences>> = ({ email, name }) => {
  const avatarQuery = useQuery(['avatar', email], () => appwrite.avatars.getInitials(name, 100, 100))

  return (
    <Flex
      position="relative"
      direction="column"
      align={{ sm: 'center' }}
      maxW="2xl"
      mx="auto"
      bg="white"
      shadow={{ sm: 'base' }}
      rounded={{ sm: 'lg' }}
      px={{ base: '6', md: '8' }}
      pb={{ base: '6', md: '8' }}
    >
      <Avatar
        mt="-10"
        borderWidth="6px"
        borderColor="white"
        size="xl"
        src={avatarQuery.data?.toString()}
        name={name || email}
      />
      <Box position="absolute" top={4} insetEnd={{ base: 4 }}>
        <Button size="sm" leftIcon={<HiPencilAlt />}>
          Edit
        </Button>
      </Box>
      <Content>
        <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
          {name || email}
        </Heading>
      </Content>
    </Flex>
  )
}
