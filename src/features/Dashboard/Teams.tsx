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
import { HiOutlineUserGroup } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { Link as RouterLink } from 'react-router-dom'
import { Meta } from '@/components/Meta'
import { listTeams } from '@/services/api'
import { CreateTeam } from './CreateTeam'

export const Teams: FC = () => {
  const { isSuccess, data } = useQuery(['teams'], listTeams)

  return (
    <>
      <Meta title="My Teams" />

      <Container maxW="5xl">
        <Flex p={6} alignItems="center">
          <Heading as="h1" size="lg">
            My Teams
          </Heading>
          <Spacer />
          <CreateTeam />
        </Flex>

        <Box p={6}>
          {isSuccess && data.teams.length === 0 && <>You are not a member of any teams yet. Why not start one?</>}

          {isSuccess && data.teams.length > 0 && (
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {data.teams.map((team) => (
                <Fragment key={team.$id}>
                  <GridItem border="1px" borderColor="gray.100" bg="gray.50" boxShadow="sm" borderRadius="lg" p={5}>
                    <Stack spacing={2}>
                      <Icon mx="auto" as={HiOutlineUserGroup} fontSize={64} color="gray.600" />
                      <HStack>
                        <Link as={RouterLink} to={`/~/teams/${team.$id}`}>
                          <Text as="div" fontSize="md" fontWeight="bold" maxW="100%">
                            {team.name}
                          </Text>
                        </Link>
                      </HStack>
                    </Stack>
                  </GridItem>
                </Fragment>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  )
}
