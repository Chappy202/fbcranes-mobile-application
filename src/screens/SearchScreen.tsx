import { useState } from 'react';
import { 
  TextInput, 
  Button, 
  Paper, 
  Title, 
  Container, 
  Stack,
  Text,
  Group,
  Box,
  Center,
  rem
} from '@mantine/core';
import { IconSearch, IconNfc } from '@tabler/icons-react';
import { Header } from '../components/Header';

export function SearchScreen({ onSearch }: { onSearch: (query: string) => void }) {
  const [serialNumber, setSerialNumber] = useState('');

  const handleSerialSearch = () => {
    if (serialNumber.trim()) {
      onSearch(serialNumber);
    }
  };

  const handleNfcScan = () => {
    // In a real implementation, this would trigger NFC scanning
    // For now, we'll just pass a placeholder value
    onSearch('NFC_TAG_DUMMY');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && serialNumber.trim()) {
      handleSerialSearch();
    }
  };

  return (
    <>
      <Header />
      <Container size="xs" py="xl" px="lg" style={{ flex: 1 }}>
        <Title order={2} ta="center" mb="md">Search Equipment</Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          Search by serial number or NFC tag
        </Text>

        <Paper radius="md" p="lg" withBorder mb="lg" shadow="sm">
          <Title order={4} mb="md">Serial Number</Title>
          <Stack>
            <TextInput
              placeholder="Enter serial number"
              value={serialNumber}
              onChange={(event) => setSerialNumber(event.currentTarget.value)}
              onKeyDown={handleKeyDown}
              radius="md"
              size="md"
              rightSection={
                <IconSearch 
                  style={{ width: rem(20), height: rem(20), cursor: 'pointer' }} 
                  stroke={1.5}
                  onClick={handleSerialSearch} 
                />
              }
            />
            <Button 
              leftSection={<IconSearch size={16} />}
              onClick={handleSerialSearch}
              fullWidth
              radius="md"
              size="md"
            >
              Search
            </Button>
          </Stack>
        </Paper>

        <Paper radius="md" p="lg" withBorder shadow="sm">
          <Title order={4} mb="md">NFC Tag</Title>
          <Text size="sm" mb="md">
            Place your device near the NFC tag to scan
          </Text>
          <Center>
            <Button 
              size="lg"
              radius="xl"
              leftSection={<IconNfc size={20} />}
              onClick={handleNfcScan}
              mt="md"
              mb="sm"
            >
              Scan NFC Tag
            </Button>
          </Center>
        </Paper>
      </Container>
    </>
  );
} 