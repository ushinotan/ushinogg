'use client'

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  VStack,
  HStack,
  Badge,
  Card,
  Grid
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Player {
  id: string
  name: string
  mmr: number
  rank: string
}

interface GameDetail {
  id: string
  createdAt: string
  winningTeam: 'BLUE' | 'RED' | null
  blueTeam: Player[]
  redTeam: Player[]
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
}

export default function GameDetail() {
  const params = useParams()
  const [game, setGame] = useState<GameDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: APIから試合詳細を取得
    const mockGame: GameDetail = {
      id: params.id as string,
      createdAt: '2025-10-19T10:00:00Z',
      winningTeam: params.id === 'new' ? null : 'BLUE',
      status: params.id === 'new' ? 'PENDING' : 'COMPLETED',
      blueTeam: [
        { id: '1', name: 'Player1', mmr: 1500, rank: 'Gold' },
        { id: '2', name: 'Player2', mmr: 1600, rank: 'Platinum' },
        { id: '3', name: 'Player3', mmr: 1400, rank: 'Silver' },
        { id: '4', name: 'Player4', mmr: 1550, rank: 'Gold' },
        { id: '5', name: 'Player5', mmr: 1450, rank: 'Gold' }
      ],
      redTeam: [
        { id: '6', name: 'Player6', mmr: 1520, rank: 'Gold' },
        { id: '7', name: 'Player7', mmr: 1580, rank: 'Platinum' },
        { id: '8', name: 'Player8', mmr: 1420, rank: 'Silver' },
        { id: '9', name: 'Player9', mmr: 1530, rank: 'Gold' },
        { id: '10', name: 'Player10', mmr: 1470, rank: 'Gold' }
      ]
    }
    
    setTimeout(() => {
      setGame(mockGame)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleShuffleTeams = () => {
    // TODO: チームシャッフルロジック実装
    alert('チームをシャッフルします')
  }

  const handleRecordResult = (winner: 'BLUE' | 'RED') => {
    // TODO: 勝敗記録API呼び出し
    alert(`${winner === 'BLUE' ? '青' : '赤'}チームの勝利を記録します`)
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>読み込み中...</Text>
      </Container>
    )
  }

  if (!game) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>試合が見つかりません</Text>
      </Container>
    )
  }

  const blueTeamAvgMMR = game.blueTeam.reduce((sum, p) => sum + p.mmr, 0) / game.blueTeam.length
  const redTeamAvgMMR = game.redTeam.reduce((sum, p) => sum + p.mmr, 0) / game.redTeam.length

  return (
    <Container maxW="container.xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="xl">試合詳細</Heading>
        <Link href="/games" passHref>
          <Button variant="outline">戻る</Button>
        </Link>
      </HStack>

      <VStack gap={6} align="stretch">
        <Card.Root>
          <Card.Body>
            <VStack align="start" gap={2}>
              <Text>
                <strong>日時:</strong> {new Date(game.createdAt).toLocaleString('ja-JP')}
              </Text>
              <Text>
                <strong>ステータス:</strong>{' '}
                <Badge 
                  colorScheme={
                    game.status === 'COMPLETED' ? 'green' : 
                    game.status === 'IN_PROGRESS' ? 'yellow' : 'gray'
                  }
                >
                  {game.status === 'COMPLETED' ? '完了' : 
                   game.status === 'IN_PROGRESS' ? '進行中' : '待機中'}
                </Badge>
              </Text>
              {game.winningTeam && (
                <Text>
                  <strong>勝利チーム:</strong>{' '}
                  <Badge colorScheme={game.winningTeam === 'BLUE' ? 'blue' : 'red'}>
                    {game.winningTeam === 'BLUE' ? '青チーム' : '赤チーム'}
                  </Badge>
                </Text>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>

        {game.status === 'PENDING' && (
          <HStack gap={4}>
            <Button colorScheme="red" variant="outline" onClick={handleShuffleTeams}>
              チームを再シャッフル
            </Button>
            <Button colorScheme="blue" onClick={() => handleRecordResult('BLUE')}>
              青チーム勝利
            </Button>
            <Button colorScheme="red" onClick={() => handleRecordResult('RED')}>
              赤チーム勝利
            </Button>
          </HStack>
        )}

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
          <Card.Root borderColor="blue.500" borderWidth={2}>
            <Card.Header>
              <Heading size="md" color="blue.600">青チーム</Heading>
              <Text fontSize="sm" color="gray.600">
                平均MMR: {blueTeamAvgMMR.toFixed(0)}
              </Text>
            </Card.Header>
            <Card.Body>
              <VStack align="stretch" gap={3}>
                {game.blueTeam.map((player) => (
                  <Box key={player.id} p={3} bg="blue.50" borderRadius="md">
                    <HStack justify="space-between">
                      <Text fontWeight="bold">{player.name}</Text>
                      <HStack>
                        <Badge>{player.rank}</Badge>
                        <Text fontSize="sm" color="gray.600">MMR: {player.mmr}</Text>
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>

          <Card.Root borderColor="red.500" borderWidth={2}>
            <Card.Header>
              <Heading size="md" color="red.600">赤チーム</Heading>
              <Text fontSize="sm" color="gray.600">
                平均MMR: {redTeamAvgMMR.toFixed(0)}
              </Text>
            </Card.Header>
            <Card.Body>
              <VStack align="stretch" gap={3}>
                {game.redTeam.map((player) => (
                  <Box key={player.id} p={3} bg="red.50" borderRadius="md">
                    <HStack justify="space-between">
                      <Text fontWeight="bold">{player.name}</Text>
                      <HStack>
                        <Badge>{player.rank}</Badge>
                        <Text fontSize="sm" color="gray.600">MMR: {player.mmr}</Text>
                      </HStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>
        </Grid>
      </VStack>
    </Container>
  )
}
