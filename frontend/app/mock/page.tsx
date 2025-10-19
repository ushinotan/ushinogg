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
  Grid,
  Input,
  Tabs
} from '@chakra-ui/react'

export default function MockPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="2xl" mb={8} textAlign="center">
        デザインMOCKページ
      </Heading>

      <VStack gap={8} align="stretch">
        {/* カラーパレット */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">カラーパレット</Heading>
          </Card.Header>
          <Card.Body>
            <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
              <Box bg="red.600" p={4} borderRadius="md" color="white">
                <Text fontWeight="bold">Primary Red</Text>
                <Text fontSize="sm">主要カラー</Text>
              </Box>
              <Box bg="red.400" p={4} borderRadius="md" color="white">
                <Text fontWeight="bold">Light Red</Text>
                <Text fontSize="sm">アクセント</Text>
              </Box>
              <Box bg="red.800" p={4} borderRadius="md" color="white">
                <Text fontWeight="bold">Dark Red</Text>
                <Text fontSize="sm">強調</Text>
              </Box>
              <Box bg="green.500" p={4} borderRadius="md" color="white">
                <Text fontWeight="bold">Green</Text>
                <Text fontSize="sm">成功</Text>
              </Box>
              <Box bg="gray.700" p={4} borderRadius="md" color="white">
                <Text fontWeight="bold">Gray</Text>
                <Text fontSize="sm">中立</Text>
              </Box>
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* ボタンスタイル */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">ボタンスタイル</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="start" gap={4}>
              <HStack gap={4} flexWrap="wrap">
                <Button colorScheme="red">プライマリ</Button>
                <Button colorScheme="red" variant="outline">アウトライン</Button>
                <Button colorScheme="red" variant="subtle">サブトル</Button>
                <Button colorScheme="green">成功</Button>
                <Button variant="outline">デフォルト</Button>
                <Button variant="ghost">ゴースト</Button>
              </HStack>
              <HStack gap={4} flexWrap="wrap">
                <Button size="sm">小</Button>
                <Button size="md">中</Button>
                <Button size="lg">大</Button>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* バッジとステータス */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">バッジとステータス</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="start" gap={4}>
              <HStack gap={2} flexWrap="wrap">
                <Badge colorScheme="blue">青チーム</Badge>
                <Badge colorScheme="red">赤チーム</Badge>
                <Badge colorScheme="green">勝利</Badge>
                <Badge colorScheme="gray">待機中</Badge>
                <Badge colorScheme="yellow">進行中</Badge>
              </HStack>
              <HStack gap={2} flexWrap="wrap">
                <Badge>Iron</Badge>
                <Badge colorScheme="orange">Bronze</Badge>
                <Badge colorScheme="gray">Silver</Badge>
                <Badge colorScheme="yellow">Gold</Badge>
                <Badge colorScheme="cyan">Platinum</Badge>
                <Badge colorScheme="blue">Diamond</Badge>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* フォーム要素 */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">フォーム要素</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <Box>
                <Text mb={2}>テキスト入力</Text>
                <Input placeholder="プレイヤー名を入力" />
              </Box>
              <Box>
                <Text mb={2}>検索</Text>
                <Input placeholder="試合を検索..." />
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* チームカードプレビュー */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">チームカードプレビュー</Heading>
          </Card.Header>
          <Card.Body>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
              <Card.Root borderColor="blue.500" borderWidth={2}>
                <Card.Header>
                  <Heading size="md" color="blue.600">青チーム</Heading>
                  <Text fontSize="sm" color="gray.600">平均MMR: 1500</Text>
                </Card.Header>
                <Card.Body>
                  <VStack align="stretch" gap={2}>
                    {['Player1', 'Player2', 'Player3', 'Player4', 'Player5'].map((name) => (
                      <Box key={name} p={2} bg="blue.50" borderRadius="md">
                        <HStack justify="space-between">
                          <Text>{name}</Text>
                          <Badge>Gold</Badge>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>

              <Card.Root borderColor="red.500" borderWidth={2}>
                <Card.Header>
                  <Heading size="md" color="red.600">赤チーム</Heading>
                  <Text fontSize="sm" color="gray.600">平均MMR: 1480</Text>
                </Card.Header>
                <Card.Body>
                  <VStack align="stretch" gap={2}>
                    {['Player6', 'Player7', 'Player8', 'Player9', 'Player10'].map((name) => (
                      <Box key={name} p={2} bg="red.50" borderRadius="md">
                        <HStack justify="space-between">
                          <Text>{name}</Text>
                          <Badge>Silver</Badge>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* タブ */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">タブナビゲーション</Heading>
          </Card.Header>
          <Card.Body>
            <Tabs.Root defaultValue="tab1">
              <Tabs.List>
                <Tabs.Trigger value="tab1">試合情報</Tabs.Trigger>
                <Tabs.Trigger value="tab2">統計</Tabs.Trigger>
                <Tabs.Trigger value="tab3">履歴</Tabs.Trigger>
              </Tabs.List>
              <Box pt={4}>
                <Tabs.Content value="tab1">
                  <Text>試合情報の内容</Text>
                </Tabs.Content>
                <Tabs.Content value="tab2">
                  <Text>統計の内容</Text>
                </Tabs.Content>
                <Tabs.Content value="tab3">
                  <Text>履歴の内容</Text>
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </Card.Body>
        </Card.Root>

        {/* レスポンシブグリッド */}
        <Card.Root>
          <Card.Header>
            <Heading size="lg">レスポンシブグリッド</Heading>
          </Card.Header>
          <Card.Body>
            <Grid 
              templateColumns={{ 
                base: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              }} 
              gap={4}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Box key={i} bg="gray.100" p={4} borderRadius="md" textAlign="center">
                  <Text>アイテム {i}</Text>
                </Box>
              ))}
            </Grid>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  )
}
