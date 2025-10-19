'use client'

import { Container, Heading, Text, Button, VStack, Card } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'

export default function SignIn() {
  const handleDiscordLogin = () => {
    signIn('discord', { callbackUrl: '/games' })
  }

  return (
    <Container maxW="container.md" py={20}>
      <Card.Root>
        <Card.Body>
          <VStack gap={6}>
            <Heading size="xl">ログイン</Heading>
            <Text color="gray.600" textAlign="center">
              Discordアカウントでログインしてください
            </Text>
            <Button 
              colorScheme="purple" 
              size="lg" 
              width="full"
              onClick={handleDiscordLogin}
            >
              Discordでログイン
            </Button>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます
            </Text>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Container>
  )
}
