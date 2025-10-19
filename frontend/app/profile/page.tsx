'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  Card,
  Select,
  createToaster,
  createListCollection
} from '@chakra-ui/react'
import { useState } from 'react'

const toaster = createToaster({
  placement: 'bottom-end',
  duration: 3000,
})

interface PlayerInfo {
  id: number
  discordId: string
  discordUsername: string
  summonerName: string
  summonerRegion: string
  currentRank: string | null
  currentTier: string | null
  currentDivision: string | null
  currentLp: number | null
  mmr: number
}

export default function ProfilePage() {
  const [summonerName, setSummonerName] = useState('')
  const [region, setRegion] = useState('jp1')
  const [isLoading, setIsLoading] = useState(false)
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)

  const handleRegisterSummoner = async () => {
    if (!summonerName) {
      toaster.create({
        title: 'エラー',
        description: 'サモナー名を入力してください',
        type: 'error',
      })
      return
    }

    setIsLoading(true)
    try {
      // TODO: 実際のプレイヤーIDを使用
      const mockPlayerId = 1
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/players/${mockPlayerId}/register-summoner`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerId: mockPlayerId,
            summonerName,
            region,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setPlayerInfo(data)
        toaster.create({
          title: '登録成功',
          description: 'サモナー情報が登録されました',
          type: 'success',
        })
      } else {
        throw new Error('サモナーが見つかりません')
      }
    } catch {
      toaster.create({
        title: 'エラー',
        description: 'サモナー情報の取得に失敗しました',
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="xl" mb={2} color="red.700">
            プロフィール設定
          </Heading>
          <Text color="gray.600">
            サモナー名を登録すると、ランクから自動的にMMRが計算されます
          </Text>
        </Box>

        <Card.Root>
          <Card.Header>
            <Heading size="md">サモナー情報登録</Heading>
          </Card.Header>
          <Card.Body>
            <VStack gap={4} align="stretch">
              <Box>
                <Text mb={2} fontWeight="bold">
                  サモナー名
                </Text>
                <Input
                  placeholder="サモナー名を入力"
                  value={summonerName}
                  onChange={(e) => setSummonerName(e.target.value)}
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="bold">
                  リージョン
                </Text>
                <Select.Root 
                  collection={createListCollection({ items: [
                    { label: '日本 (JP1)', value: 'jp1' },
                    { label: '韓国 (KR)', value: 'kr' },
                    { label: '北米 (NA1)', value: 'na1' },
                    { label: 'EU西部 (EUW1)', value: 'euw1' },
                    { label: 'EU北東部 (EUN1)', value: 'eun1' },
                  ]})}
                  value={[region]} 
                  onValueChange={(e) => setRegion(e.value[0])}
                >
                  <Select.Trigger>
                    <Select.ValueText placeholder="リージョンを選択" />
                  </Select.Trigger>
                  <Select.Content>
                    {[
                      { label: '日本 (JP1)', value: 'jp1' },
                      { label: '韓国 (KR)', value: 'kr' },
                      { label: '北米 (NA1)', value: 'na1' },
                      { label: 'EU西部 (EUW1)', value: 'euw1' },
                      { label: 'EU北東部 (EUN1)', value: 'eun1' },
                    ].map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>

              <Button
                colorScheme="red"
                onClick={handleRegisterSummoner}
                loading={isLoading}
              >
                サモナー情報を登録
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>

        {playerInfo && (
          <Card.Root>
            <Card.Header>
              <Heading size="md">登録済み情報</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="start" gap={2}>
                <Text>
                  <strong>サモナー名:</strong> {playerInfo.summonerName}
                </Text>
                <Text>
                  <strong>現在のランク:</strong> {playerInfo.currentRank || 'UNRANKED'}
                </Text>
                {playerInfo.currentLp !== null && (
                  <Text>
                    <strong>LP:</strong> {playerInfo.currentLp}
                  </Text>
                )}
                <Text>
                  <strong>推定MMR:</strong> {playerInfo.mmr}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  ※ MMRはソロランクから自動計算されます
                </Text>
              </VStack>
            </Card.Body>
          </Card.Root>
        )}

        <Box>
          <Heading size="md" mb={3}>
            MMR計算について
          </Heading>
          <VStack align="start" gap={2}>
            <Text fontSize="sm">
              • ランクとLPから自動的にMMRを計算します
            </Text>
            <Text fontSize="sm">
              • Iron: 800～, Bronze: 1000～, Silver: 1200～
            </Text>
            <Text fontSize="sm">
              • Gold: 1400～, Platinum: 1800～, Emerald: 2200～
            </Text>
            <Text fontSize="sm">
              • Diamond: 2600～, Master: 3000～
            </Text>
            <Text fontSize="sm">
              • ランク未登録の場合はデフォルトMMR 1500が使用されます
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
