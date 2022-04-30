import type { ComponentStyleConfig } from '@chakra-ui/theme'

export const Link: ComponentStyleConfig = {
  defaultProps: {
    variant: 'primary',
  },
  variants: {
    primary: {
      color: 'blue.500',
    },
  },
}
