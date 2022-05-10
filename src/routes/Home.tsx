import { Box, Button, HStack, Heading, IconButton, Link, Stack, Text, VStack } from '@chakra-ui/react'
import { RiGithubLine } from 'react-icons/ri'
import { Link as RouterLink } from 'react-router-dom'

export const HomeRoute = () => {
  return (
    <Box>
      <Box as="section" bg="gray.800" color="white" py={20} minH="100vh">
        <Box maxW={{ base: 'xl', md: '5xl' }} mx="auto" px={8}>
          <Stack spacing={8} py={12}>
            <Box textAlign="center">
              <Text as="span" fontSize="lg" fontWeight="black" bgColor="blue.500" color="white" px={1} rounded="base">
                USE
              </Text>
              <Text as="span" fontSize="4xl" fontWeight="bold">
                Mindmap
              </Text>
            </Box>
            <Box textAlign="center">
              <Heading
                as="h1"
                size="3xl"
                fontWeight="extrabold"
                maxW="48rem"
                mx="auto"
                lineHeight="1.2"
                letterSpacing="tight"
              >
                Mindmaps without
                <br />
                the mindcrap
              </Heading>
              <Text fontSize="lg" mt={4} maxW="xl" mx="auto">
                useMindmap is a free tool created with Appwrite for the
                <br />
                <Link color="blue.400" href="https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0">
                  Appwrite Hackathon
                </Link>
              </Text>
            </Box>
          </Stack>

          <VStack justify="center" mt={10} mb={10} spacing={20}>
            <HStack spacing={8}>
              <Button as={RouterLink} to="/sign-in" size="lg" colorScheme="blue" px={8} fontWeight="bold" fontSize="md">
                Get started
              </Button>
              <Button
                as="a"
                href="https://dev.to/benweier/usemindmap-1j3f"
                size="lg"
                color="blue.400"
                px={8}
                fontWeight="bold"
                fontSize="md"
              >
                Read more
              </Button>
            </HStack>
            <VStack justify="center" spacing={2}>
              <Text fontSize="sm">Proudly Open Source</Text>
              <IconButton
                as="a"
                href="https://github.com/benweier/use-mind-map"
                colorScheme="black"
                variant="ghost"
                icon={<RiGithubLine />}
                aria-label="GitHub"
              />
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  )
}
