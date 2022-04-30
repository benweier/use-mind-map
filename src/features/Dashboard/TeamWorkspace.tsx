import { FC, Fragment } from 'react'
import { Box, Container, Flex, Grid, GridItem, HStack, Heading, Icon, Link, Stack, Text } from '@chakra-ui/react'
import { FcMindMap } from 'react-icons/fc'
import { useQuery, useQueryClient } from 'react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { listMindMaps } from '@/services/api'
import { MindMapCollectionID } from '@/services/appwrite'
import { Models } from 'appwrite'
import { CreateMindMind } from './CreateMindMap'

const WorkspaceDocuments: FC<{ id: MindMapCollectionID }> = ({ id }) => {
  const { isSuccess, data } = useQuery(['documents', id], () => listMindMaps(id))

  return (
    <Box>
      <Stack spacing={6}>
        <Heading as="h2" size="md">
          Mind Maps
        </Heading>

        <HStack>
          <CreateMindMind workspace={id} />
        </HStack>

        {isSuccess && data.documents.length > 0 && (
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {data.documents.map((document) => (
              <Fragment key={document.$id}>
                <GridItem border="1px" borderColor="gray.100" bg="gray.50" boxShadow="sm" borderRadius="lg" p={5}>
                  <Stack spacing={2}>
                    <Icon mx="auto" as={FcMindMap} fontSize={64} />
                    <HStack>
                      <Link as={RouterLink} to={`/~/maps/${document.$collection}/${document.$id}`}>
                        <Text as="div" fontSize="md" fontWeight="bold">
                          {document.name}
                        </Text>
                      </Link>
                    </HStack>
                  </Stack>
                </GridItem>
              </Fragment>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  )
}

export const TeamWorkspace: FC = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const teams = queryClient.getQueryData<Models.TeamList>(['teams'])
  const team = teams?.teams.find((team) => team.$id === id)

  if (!team) return <></>

  return (
    <>
      <Meta title={team.name} />

      <Container maxW="5xl">
        <Flex p={6} alignItems="center">
          <Stack spacing={2}>
            <Heading as="h1" size="lg">
              {team.name}
            </Heading>
          </Stack>
        </Flex>

        <Box p={6}>
          <Stack spacing={8}>{id && <WorkspaceDocuments id={`team-${id}`} />}</Stack>
        </Box>
      </Container>
    </>
  )
}
