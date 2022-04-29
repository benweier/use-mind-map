import { ForwardedRef, forwardRef, useRef } from 'react'
import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react'
import { HiEye, HiEyeOff } from 'react-icons/hi'

const PasswordInputComponent = (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { isOpen, onToggle } = useDisclosure()
  const inputRef = useRef<HTMLInputElement>(null)

  const refs = useMergeRefs(inputRef, ref)
  const onClickReveal = () => {
    onToggle()
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }

  return (
    <>
      <InputGroup>
        <Input id="password" ref={refs} name="password" type={isOpen ? 'text' : 'password'} required {...props} />
        <InputRightElement>
          <IconButton
            variant="ghost"
            aria-label={isOpen ? 'Hide password' : 'Show password'}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
      </InputGroup>
    </>
  )
}

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(PasswordInputComponent)
