import { useState, useEffect } from 'react';
import { 
  TextInput, 
  Button, 
  Paper, 
  Title, 
  Container, 
  Stack,
  Text,
  Box,
  Center,
  rem,
  LoadingOverlay,
  SegmentedControl,
  ThemeIcon,
  ActionIcon,
  Flex
} from '@mantine/core';
import { 
  IconSearch, 
  IconNfc, 
  IconTag, 
  IconBarcode, 
  IconDeviceMobile,
  IconArrowRight
} from '@tabler/icons-react';
import { Header } from '../components/Header';

type SearchMethod = 'serial' | 'tag';

interface SearchProps {
  onSearch: (value: string, method: SearchMethod) => void;
  loading: boolean;
}

export function SearchScreen({ onSearch, loading }: SearchProps) {
  const [serialNumber, setSerialNumber] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [searchMode, setSearchMode] = useState<string>('typing');
  const [searchType, setSearchType] = useState<string>('serial');
  const [pulseOpacity, setPulseOpacity] = useState(0.3);
  const [pulseScale, setPulseScale] = useState(1);

  // Simple pulse effect
  useEffect(() => {
    if (searchMode === 'nfc' && !loading) {
      const interval = setInterval(() => {
        setPulseOpacity(prev => prev === 0.3 ? 0.7 : 0.3);
        setPulseScale(prev => prev === 1 ? 1.3 : 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [searchMode, loading]);

  const handleSerialSearch = () => {
    if (serialNumber.trim()) {
      onSearch(serialNumber, 'serial');
    }
  };

  const handleTagSearch = () => {
    if (tagNumber.trim()) {
      onSearch(tagNumber, 'tag');
    }
  };

  const handleNfcScan = () => {
    // In a real implementation, this would trigger NFC scanning
    // For now, we'll just use a hard-coded tag number
    onSearch('147524', 'tag');
  };

  const handleSearch = () => {
    if (searchType === 'serial') {
      handleSerialSearch();
    } else {
      handleTagSearch();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
      <Header />
      <Container size="100%" pt="md" pb="xl" px="xs" style={{ flex: 1 }}>
        <Title order={2} ta="center" mb="xs">Search Inspections</Title>

        <Box py="xl">
          <SegmentedControl
            value={searchMode}
            onChange={setSearchMode}
            data={[
              {
                value: 'typing',
                label: (
                  <Center>
                    <IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    <Box ml={10}>Manual</Box>
                  </Center>
                ),
              },
              {
                value: 'nfc',
                label: (
                  <Center>
                    <IconNfc style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    <Box ml={10}>NFC Scan</Box>
                  </Center>
                ),
              },
            ]}
            fullWidth
            size="md"
            radius="xl"
          />
        </Box>

        {searchMode === 'typing' ? (
          <Paper radius="lg" p="lg" withBorder shadow="md">
            <Stack gap="lg">
              <SegmentedControl
                value={searchType}
                onChange={setSearchType}
                data={[
                  {
                    value: 'serial',
                    label: (
                      <Center>
                        <IconBarcode style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        <Box ml={10}>Serial Number</Box>
                      </Center>
                    ),
                  },
                  {
                    value: 'tag',
                    label: (
                      <Center>
                        <IconTag style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        <Box ml={10}>Tag Number</Box>
                      </Center>
                    ),
                  },
                ]}
                fullWidth
                size="sm"
                radius="md"
                color="blue"
              />

              <Box>
                <TextInput
                  placeholder={searchType === 'serial' ? "Enter serial number (e.g. 99638)" : "Enter tag number (e.g. 147524)"}
                  value={searchType === 'serial' ? serialNumber : tagNumber}
                  onChange={(event) => 
                    searchType === 'serial' 
                      ? setSerialNumber(event.currentTarget.value)
                      : setTagNumber(event.currentTarget.value)
                  }
                  onKeyDown={handleKeyDown}
                  radius="xl"
                  size="lg"
                  disabled={loading}
                  leftSection={
                    <ThemeIcon color="blue" variant="light" radius="xl" size="md">
                      {searchType === 'serial' 
                        ? <IconBarcode style={{ width: rem(16), height: rem(16) }} stroke={1.5} /> 
                        : <IconTag style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                      }
                    </ThemeIcon>
                  }
                  rightSection={
                    <ActionIcon 
                      variant="filled" 
                      color="blue" 
                      radius="xl"
                      disabled={loading || !(searchType === 'serial' ? serialNumber.trim() : tagNumber.trim())}
                      onClick={handleSearch}
                    >
                      <IconArrowRight style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </ActionIcon>
                  }
                />
              </Box>

              <Text c="dimmed" size="sm" ta="center">
                Enter the {searchType === 'serial' ? 'serial' : 'tag'} number of the equipment you want to inspect
              </Text>
            </Stack>
          </Paper>
        ) : (
          <Paper radius="lg" p="xl" withBorder shadow="md">
            <Flex direction="column" align="center" gap="xl">
              <Box>
                <Text fw={600} size="lg" ta="center">
                  NFC Scan
                </Text>
                <Text c="dimmed" size="sm" ta="center" mt="xs">
                  Place your device near the NFC tag to scan
                </Text>
              </Box>
              
              <Box pos="relative" w={180} h={180} my="md">
                <ThemeIcon 
                  radius={100} 
                  size={180} 
                  variant="light" 
                  color="blue"
                  style={{ position: 'absolute', zIndex: 1 }}
                >
                  <IconDeviceMobile style={{ width: rem(60), height: rem(60) }} stroke={1.5} />
                </ThemeIcon>
                
                {!loading && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '100%',
                      border: '2px solid rgba(34, 139, 230, 0.3)',
                      opacity: pulseOpacity,
                      transform: `scale(${pulseScale})`,
                      transition: 'opacity 0.5s ease, transform 0.5s ease'
                    }}
                  />
                )}
              </Box>
              
              <Button 
                size="lg"
                radius="xl"
                leftSection={<IconNfc size={20} />}
                onClick={handleNfcScan}
                loading={loading}
                disabled={loading}
                fullWidth
              >
                Start NFC Scan
              </Button>
            </Flex>
          </Paper>
        )}
      </Container>
    </>
  );
} 