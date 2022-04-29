import { Avatar, Box, HStack, Text } from '@chakra-ui/react'

interface UserProfileProps {
  name: string
  image: string
  email: string
}

export const UserProfile = (props: UserProfileProps) => {
  const { name, image, email } = props
  return (
    <HStack spacing="3">
      <Avatar name={name} src={image} boxSize="10" />
      <Box maxW={148}>
        <Text as="div" fontWeight="medium" fontSize="sm" isTruncated>
          {name || 'Unknown'}
        </Text>
        <Text as="div" fontSize="xs" isTruncated>
          {email}
        </Text>
      </Box>
    </HStack>
  )
}
