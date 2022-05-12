import { FC, Fragment } from 'react'
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Link,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react'
import { FcMindMap } from 'react-icons/fc'
import { useQuery } from 'react-query'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { getTeam, listMindMaps } from '@/services/api'
import { MindMapCollectionID } from '@/services/appwrite'
import { CreateMindMind } from './CreateMindMap'
import { InviteMember } from './InviteMember'
import { MindMapActions } from './MindMapActions'

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
      </Stack>
    </Box>
  )
}

export const TeamWorkspace: FC = () => {
  const { id } = useParams()
  const { data, isSuccess } = useQuery(['team', id], () => (id ? getTeam(id) : Promise.reject('Missing ID')))

  if (!isSuccess) return <></>

  return (
    <>
      <Meta title={data.name} />

      <Container maxW="5xl">
        <Flex p={6} alignItems="center">
          <Heading as="h1" size="lg">
            {data.name}
          </Heading>
          <Spacer />
          <InviteMember id={data.$id} />
        </Flex>

        <Box p={6}>
          <Stack spacing={8}>{id && <WorkspaceDocuments id={`team-${id}`} />}</Stack>
        </Box>
      </Container>
    </>
  )
}
