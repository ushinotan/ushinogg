'use client'

import { Box, Container, Heading, Text, Button, VStack, HStack } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center" py={10}>
          <Heading size="2xl" mb={4}>
            LOLカスタムゲーム
          </Heading>
          <Heading size="xl" mb={6}>
            チーム分けツール
          </Heading>
          <Text fontSize="lg" color="gray.600">
            League of Legendsのカスタムゲームで公平なチーム分けを実現
          </Text>
        </Box>

        <HStack gap={4} justify="center" flexWrap="wrap">
          <Link href="/auth/signin" passHref>
            <Button colorScheme="red" size="lg">
              Discordでログイン
            </Button>
          </Link>
          <Link href="/profile" passHref>
            <Button colorScheme="red" variant="outline" size="lg">
              サモナー登録
            </Button>
          </Link>
          <Link href="/games" passHref>
            <Button variant="outline" size="lg" borderColor="red.500" color="red.600" _hover={{ bg: 'red.50' }}>
              試合履歴を見る
            </Button>
          </Link>
          <Link href="/mock" passHref>
            <Button variant="outline" size="lg" borderColor="red.500" color="red.600" _hover={{ bg: 'red.50' }}>
              デザインMOCK
            </Button>
          </Link>
        </HStack>

        <Box bg="red.50" p={8} borderRadius="md" borderWidth={1} borderColor="red.200">
          <Heading size="lg" mb={4} color="red.700">
            主な機能
          </Heading>
          <VStack align="start" gap={3}>
            <Text color="red.900">✓ Discordアカウントでログイン</Text>
            <Text color="red.900">✓ サモナー名登録とランクからのMMR自動計算</Text>
            <Text color="red.900">✓ カスタムゲームの試合履歴閲覧</Text>
            <Text color="red.900">✓ MMRベースの自動チーム分け</Text>
            <Text color="red.900">✓ Discord Botからの試合作成</Text>
            <Text color="red.900">✓ 勝敗記録と統計</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
