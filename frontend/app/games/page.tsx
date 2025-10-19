'use client'

import { 
  Box, 
  Container, 
  Heading, 
  Table, 
  Button, 
  HStack,
  Badge,
  Text
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Game {
  id: string
  createdAt: string
  winningTeam: 'BLUE' | 'RED'
  blueTeamPlayers: string[]
  redTeamPlayers: string[]
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: APIから試合履歴を取得
    // 仮のモックデータ
    const mockGames: Game[] = [
      {
        id: '1',
        createdAt: '2025-10-19T10:00:00Z',
        winningTeam: 'BLUE',
        blueTeamPlayers: ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
        redTeamPlayers: ['Player6', 'Player7', 'Player8', 'Player9', 'Player10']
      },
      {
        id: '2',
        createdAt: '2025-10-18T15:30:00Z',
        winningTeam: 'RED',
        blueTeamPlayers: ['PlayerA', 'PlayerB', 'PlayerC', 'PlayerD', 'PlayerE'],
        redTeamPlayers: ['PlayerF', 'PlayerG', 'PlayerH', 'PlayerI', 'PlayerJ']
      }
    ]
    
    setTimeout(() => {
      setGames(mockGames)
      setLoading(false)
    }, 500)
  }, [])

  return (
    <Container maxW="container.xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="xl" color="red.700">試合履歴</Heading>
        <Link href="/game/new" passHref>
          <Button colorScheme="red">新しい試合を作成</Button>
        </Link>
      </HStack>

      {loading ? (
        <Text>読み込み中...</Text>
      ) : games.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">まだ試合がありません</Text>
        </Box>
      ) : (
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>日時</Table.ColumnHeader>
              <Table.ColumnHeader>勝利チーム</Table.ColumnHeader>
              <Table.ColumnHeader>青チーム</Table.ColumnHeader>
              <Table.ColumnHeader>赤チーム</Table.ColumnHeader>
              <Table.ColumnHeader>操作</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {games.map((game) => (
              <Table.Row key={game.id}>
                <Table.Cell>
                  {new Date(game.createdAt).toLocaleString('ja-JP')}
                </Table.Cell>
                <Table.Cell>
                  <Badge colorScheme={game.winningTeam === 'BLUE' ? 'blue' : 'red'}>
                    {game.winningTeam === 'BLUE' ? '青チーム' : '赤チーム'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm">{game.blueTeamPlayers.join(', ')}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm">{game.redTeamPlayers.join(', ')}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Link href={`/game/${game.id}`} passHref>
                    <Button size="sm" variant="outline">詳細</Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Container>
  )
}
