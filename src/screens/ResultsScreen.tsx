import { 
  Button, 
  Paper, 
  Title, 
  Container, 
  Text,
  Box,
  Group,
  Stack,
  Card,
  Badge,
  Divider,
  rem
} from '@mantine/core';
import { IconArrowLeft, IconClipboard, IconTool } from '@tabler/icons-react';
import { Header } from '../components/Header';

interface ResultsProps {
  query: string;
  onBack: () => void;
}

export function ResultsScreen({ query, onBack }: ResultsProps) {
  // This would typically fetch data based on the query
  // For now, we'll display mock data
  const mockEquipment = {
    serialNumber: query.startsWith('NFC') ? 'CR-12345' : query,
    name: 'Mobile Crane XL-5000',
    status: 'Operational',
    lastInspection: '2023-10-15',
    nextInspection: '2024-04-15',
    location: 'Site A - Melbourne'
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container size="xs" py="xl" px="md" style={{ flex: 1 }}>
        <Group mb="lg">
          <Button 
            variant="subtle" 
            leftSection={<IconArrowLeft size={rem(16)} stroke={1.5} />}
            onClick={onBack}
            radius="md"
          >
            Back to Search
          </Button>
        </Group>

        <Title order={2} mb="md">Equipment Details</Title>
        <Text c="dimmed" size="sm" mb="xl">
          Results for {query.startsWith('NFC') ? 'NFC Tag' : `Serial Number: ${query}`}
        </Text>

        <Card withBorder radius="md" p="lg" mb="xl" shadow="sm">
          <Stack>
            <Group justify="space-between" wrap="nowrap">
              <Title order={3}>{mockEquipment.name}</Title>
              <Badge 
                color={mockEquipment.status === 'Operational' ? 'green' : 'red'}
                variant="filled"
                size="lg"
              >
                {mockEquipment.status}
              </Badge>
            </Group>
            
            <Group>
              <Text fw={500}>Serial Number:</Text>
              <Text>{mockEquipment.serialNumber}</Text>
            </Group>
            
            <Group>
              <Text fw={500}>Location:</Text>
              <Text>{mockEquipment.location}</Text>
            </Group>

            <Divider my="sm" />
            
            <Group>
              <Text fw={500}>Last Inspection:</Text>
              <Text>{mockEquipment.lastInspection}</Text>
            </Group>
            
            <Group>
              <Text fw={500}>Next Inspection:</Text>
              <Text>{mockEquipment.nextInspection}</Text>
            </Group>
          </Stack>
        </Card>

        <Group grow>
          <Button 
            leftSection={<IconClipboard size={rem(16)} stroke={1.5} />}
            radius="md"
            size="md"
          >
            View Reports
          </Button>
          <Button 
            leftSection={<IconTool size={rem(16)} stroke={1.5} />}
            radius="md"
            size="md"
          >
            Request Service
          </Button>
        </Group>
      </Container>
    </Box>
  );
} 