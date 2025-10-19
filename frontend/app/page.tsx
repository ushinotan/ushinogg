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
            <Button colorScheme="blue" size="lg">
              Discordでログイン
            </Button>
          </Link>
          <Link href="/profile" passHref>
            <Button colorScheme="purple" size="lg">
              サモナー登録
            </Button>
          </Link>
          <Link href="/games" passHref>
            <Button variant="outline" size="lg">
              試合履歴を見る
            </Button>
          </Link>
          <Link href="/mock" passHref>
            <Button variant="outline" size="lg">
              デザインMOCK
            </Button>
          </Link>
        </HStack>

        <Box bg="gray.50" p={8} borderRadius="md">
          <Heading size="lg" mb={4}>
            主な機能
          </Heading>
          <VStack align="start" gap={3}>
            <Text>✓ Discordアカウントでログイン</Text>
            <Text>✓ サモナー名登録とランクからのMMR自動計算</Text>
            <Text>✓ カスタムゲームの試合履歴閲覧</Text>
            <Text>✓ MMRベースの自動チーム分け</Text>
            <Text>✓ Discord Botからの試合作成</Text>
            <Text>✓ 勝敗記録と統計</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
