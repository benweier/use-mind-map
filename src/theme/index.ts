import { extendTheme } from '@chakra-ui/react'
import { Button } from './button'
import { Link } from './link'

export const theme = extendTheme({
  components: {
    Button,
    Link,
  },
})
