import { DeleteIcon } from '@chakra-ui/icons'
import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react'
import { HiDotsVertical } from 'react-icons/hi'
import { useMutation, useQueryClient } from 'react-query'
import { deleteMindMap } from '@/services/api'

export const MindMapActions = ({ workspace, id }: { workspace: string; id: string }) => {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { mutate, isLoading } = useMutation(() => deleteMindMap(workspace, id), {
    onSuccess: () => {
      void queryClient.invalidateQueries(['documents', workspace])
      toast({
        title: 'Mindmap deleted!',
        status: 'success',
        position: 'bottom',
      })
    },
  })

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        size="sm"
        variant="ghost"
        disabled={isLoading}
        icon={<Icon as={HiDotsVertical} fontSize="sm" />}
      />
      <MenuList>
        <MenuItem fontSize="sm" icon={<DeleteIcon />} onClick={() => mutate()}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
