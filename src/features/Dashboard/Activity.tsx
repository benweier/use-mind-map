import { FC, Fragment } from 'react'
import { Box, Container, Flex, Grid, GridItem, HStack, Heading, Icon, Link, Stack, Text } from '@chakra-ui/react'
import { FcMindMap } from 'react-icons/fc'
import { useQuery } from 'react-query'
import { Link as RouterLink } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { getAccount, listMindMaps, listTeams } from '@/services/api'
import { MindMapCollectionID } from '@/services/appwrite'
import { CreateMindMind } from './CreateMindMap'
import { MindMapActions } from './MindMapActions'

const WorkspaceDocuments: FC<{ id: MindMapCollectionID }> = ({ id }) => {
  const { isSuccess, data } = useQuery(['documents', id], () => listMindMaps(id))

  return (
    <Box>
      {isSuccess && data.documents.length === 0 && (
        <Text textAlign="center" py={8}>
          No mind maps have been created. Why not start one?
        </Text>
      )}

      {isSuccess && data.documents.length > 0 && (
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {data.documents.map((document) => (
            <Fragment key={document.$id}>
              <GridItem border="1px" borderColor="gray.100" bg="gray.50" boxShadow="sm" borderRadius="lg" p={5}>
                <Stack spacing={2}>
                  <Icon mx="auto" as={FcMindMap} fontSize={64} />
                  <HStack spacing={4} justify="space-between">
                    <Link as={RouterLink} to={`/~/maps/${document.$collection}/${document.$id}`}>
                      <Text as="div" fontSize="md" fontWeight="bold" overflowWrap="anywhere">
                        {document.name}
                      </Text>
                    </Link>

                    <MindMapActions workspace={id} id={document.$id} />
                  </HStack>
                </Stack>
              </GridItem>
            </Fragment>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export const Activity: FC = () => {
  const accountQuery = useQuery(['account'], getAccount)
  const teamsQuery = useQuery(['teams'], listTeams)

  return (
    <>
      <Meta title="My Dashboard" />

      <Container maxW="5xl">
        <Flex p={6} alignItems="center">
          <Heading as="h1" size="lg">
            My Dashboard
          </Heading>
        </Flex>

        <Box p={6}>
          <Stack spacing={16}>
            <Heading as="h2" size="md">
              Workspaces
            </Heading>

            {accountQuery.isSuccess && (
              <Stack spacing={4}>
                <HStack justify="space-between" spacing={4}>
                  <Heading as="div" size="sm" color="gray.600">
                    {accountQuery.data.name}{' '}
                    <Text as="span" fontSize="xs" color="gray.500">
                      (PRIVATE)
                    </Text>
                  </Heading>

                  <CreateMindMind workspace={`user-${accountQuery.data.$id}`} />
                </HStack>

                <WorkspaceDocuments id={`user-${accountQuery.data.$id}`} />
              </Stack>
            )}
            {teamsQuery.isSuccess && (
              <Stack spacing={12}>
                {teamsQuery.data.teams.map((team) => (
                  <Fragment key={team.$id}>
                    <Stack spacing={2}>
                      <HStack justify="space-between" spacing={4}>
                        <Heading as="div" size="sm" color="gray.600">
                          {team.name}{' '}
                          <Text as="span" fontSize="xs" color="gray.500">
                            (TEAM)
                          </Text>
                        </Heading>

                        <CreateMindMind workspace={`team-${team.$id}`} />
                      </HStack>

                      <WorkspaceDocuments id={`team-${team.$id}`} />
                    </Stack>
                  </Fragment>
                ))}
              </Stack>
            )}
          </Stack>
        </Box>
      </Container>
    </>
  )
}
