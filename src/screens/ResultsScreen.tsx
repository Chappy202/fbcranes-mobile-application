import { 
  Button, 
  Title, 
  Container, 
  Text,
  Box,
  Group,
  Stack,
  Card,
  Badge,
  rem,
  LoadingOverlay,
  Timeline,
  Grid,
  Paper,
  ThemeIcon,
  Avatar,
  Flex
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconCertificate,
  IconBarcode,
  IconTag,
  IconBuilding,
  IconMap,
  IconSection,
  IconCalendarTime,
  IconCalendarDue,
  IconScale,
  IconRuler,
  IconMessageCircle,
  IconSearch,
  IconRefresh,
  IconDeviceImacSearch,
  IconNfc
} from '@tabler/icons-react';
import { Header } from '../components/Header';
import { Inspection } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import { useState } from 'react';

interface ResultsProps {
  inspection: Inspection | null;
  loading: boolean;
  error: string | null;
  searchMethod: 'serial' | 'tag';
  searchValue: string;
  onBack: () => void;
}

export function ResultsScreen({ 
  inspection, 
  loading, 
  error, 
  searchMethod, 
  searchValue, 
  onBack 
}: ResultsProps) {
  const [showFullComments, setShowFullComments] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PASS':
        return 'green';
      case 'FAIL':
        return 'red';
      case 'WARNING':
        return 'yellow';
      default:
        return 'gray';
    }
  };
  
  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Extract just the error message without the metadata
  const getErrorMessage = (errorString: string) => {
    if (!errorString) return '';
    
    // Try to extract the message if it's in a specific format
    if (errorString.includes('No inspection found with')) {
      return errorString;
    }
    
    // Fallback for other error formats
    return errorString;
  };

  const renderErrorState = () => {
    return (
      <Card withBorder radius="lg" p="xl" shadow="md">
        <Stack align="center" gap="lg">
          <ThemeIcon size={80} radius={40} color="gray">
            <IconDeviceImacSearch size={40} stroke={1.5} />
          </ThemeIcon>
          
          <Box ta="center">
            <Title order={3} mb="xs">No Results Found</Title>
            <Text c="dimmed" size="md">
              {getErrorMessage(error || `We couldn't find any inspection records for the ${searchMethod === 'serial' ? 'serial' : 'tag'} number: ${searchValue}`)}
            </Text>
          </Box>
          
          <Card withBorder p="md" radius="md" w="100%">
            <Text fw={600} mb="xs">Suggestions:</Text>
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon color="blue" variant="light" radius="xl" size="sm">
                  <IconRefresh size={14} stroke={1.5} />
                </ThemeIcon>
                <Text size="sm">Check the {searchMethod} number and try again</Text>
              </Group>
              
              <Group gap="xs">
                <ThemeIcon color="blue" variant="light" radius="xl" size="sm">
                  <IconTag size={14} stroke={1.5} />
                </ThemeIcon>
                <Text size="sm">Try searching by {searchMethod === 'serial' ? 'tag' : 'serial'} number instead</Text>
              </Group>
              
              <Group gap="xs">
                <ThemeIcon color="blue" variant="light" radius="xl" size="sm">
                  <IconNfc size={14} stroke={1.5} />
                </ThemeIcon>
                <Text size="sm">Use NFC scan if available on the equipment</Text>
              </Group>
            </Stack>
          </Card>
          
          <Flex gap="md">
            <Button
              variant="filled"
              leftSection={<IconSearch size={16} stroke={1.5} />}
              radius="md"
              color="blue"
              onClick={onBack}
              fullWidth
            >
              Try Another Search
            </Button>
          </Flex>
        </Stack>
      </Card>
    );
  };

  return (
    <>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
      <Header />
      <Container size="100%" pt="xs" pb="xl" px="xs" style={{ flex: 1 }}>
        {!error && (
          <Group justify="space-between" mb="md">
            <Button 
              variant="subtle" 
              leftSection={<IconArrowLeft size={16} stroke={1.5} />}
              onClick={onBack}
              radius="xl"
              px="xs"
            >
              Back
            </Button>
          </Group>
        )}

        {error ? (
          renderErrorState()
        ) : inspection ? (
          <Stack gap="md">
            {/* Header Card */}
            <Card withBorder radius="lg" p="md" shadow="sm">
              <Group justify="space-between" wrap="nowrap" mb="xs">
                <Text size="xs" c="dimmed">
                  Results for {searchMethod === 'serial' 
                    ? `Serial Number: ${searchValue}` 
                    : `Tag Number: ${searchValue}`}
                </Text>
                <Badge 
                  color={getStatusColor(inspection.status)}
                  variant="filled"
                  size="lg"
                  radius="md"
                >
                  {inspection.status}
                </Badge>
              </Group>
              
              <Title order={3} mt="xs">{inspection.equipDescription}</Title>
              
              {/* Key Info Card */}
              <Card withBorder mt="md" radius="md" p="sm" bg="rgba(0, 0, 0, 0.03)">
                <Grid>
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <ThemeIcon size="md" radius="xl" variant="light" color="blue">
                        <IconCertificate style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" c="dimmed">Certificate</Text>
                        <Text fw={500} size="sm">{inspection.certNumber}</Text>
                      </Box>
                    </Group>
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <ThemeIcon size="md" radius="xl" variant="light" color="indigo">
                        <IconBarcode style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" c="dimmed">Serial Number</Text>
                        <Text fw={500} size="sm">{inspection.serialNo}</Text>
                      </Box>
                    </Group>
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <ThemeIcon size="md" radius="xl" variant="light" color="grape">
                        <IconTag style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" c="dimmed">Tag Number</Text>
                        <Text fw={500} size="sm">{inspection.tagNumber}</Text>
                      </Box>
                    </Group>
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <Group gap="xs">
                      <ThemeIcon size="md" radius="xl" variant="light" color="green">
                        <IconScale style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                      </ThemeIcon>
                      <Box>
                        <Text size="xs" c="dimmed">Working Load</Text>
                        <Text fw={500} size="sm">{inspection.wwl} kg</Text>
                      </Box>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card>
            </Card>
            
            {/* Location Info */}
            <Card withBorder radius="lg" p="md" shadow="sm">
              <Text fw={600} c="dimmed" size="sm" mb="md">LOCATION</Text>
              
              <Stack gap="sm">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" variant="light" color="blue">
                    <IconBuilding style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed">Client</Text>
                    <Text fw={500}>{inspection.client}</Text>
                  </Box>
                </Group>
                
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" variant="light" color="indigo">
                    <IconMap style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed">Site</Text>
                    <Text fw={500}>{inspection.site}</Text>
                  </Box>
                </Group>
                
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" variant="light" color="violet">
                    <IconSection style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed">Section</Text>
                    <Text fw={500}>{inspection.section}</Text>
                  </Box>
                </Group>
              </Stack>
            </Card>
            
            {/* Dates and Measurements */}
            <Card withBorder radius="lg" p="md" shadow="sm">
              <Text fw={600} c="dimmed" size="sm" mb="md">INSPECTION DETAILS</Text>
              
              <Timeline active={1} bulletSize={24} lineWidth={2}>
                <Timeline.Item 
                  bullet={<IconCalendarTime size={12} />} 
                  title="Inspection Date"
                >
                  <Text c="dimmed" size="sm">{formatDate(inspection.testDate)}</Text>
                </Timeline.Item>
                
                <Timeline.Item 
                  bullet={<IconCalendarDue size={12} />}
                  title="Valid Until"
                >
                  <Text c="dimmed" size="sm">{formatDate(inspection.validDate)}</Text>
                </Timeline.Item>
              </Timeline>
              
              <Group mt="md" gap="lg">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" variant="light" color="orange">
                    <IconRuler style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                  </ThemeIcon>
                  <Box>
                    <Text size="xs" c="dimmed">Length/Height</Text>
                    <Text fw={500}>{inspection.heightLength} mm</Text>
                  </Box>
                </Group>
              </Group>
            </Card>
            
            {/* Inspector & Comments */}
            <Card withBorder radius="lg" p="md" shadow="sm">
              <Group gap="sm" mb="md">
                <Avatar 
                  size="md" 
                  radius="xl" 
                  color="blue" 
                  src={null}
                >
                  {inspection.responsible.charAt(0)}
                </Avatar>
                <Box>
                  <Text fw={500}>Inspector: {inspection.responsible}</Text>
                  <Text size="xs" c="dimmed">Certified Inspector</Text>
                </Box>
              </Group>
              
              <Paper withBorder p="sm" radius="md" bg="rgba(0, 0, 0, 0.03)">
                <Group gap="xs" mb="xs">
                  <IconMessageCircle style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                  <Text fw={500} size="sm">Comments</Text>
                </Group>
                <Text size="sm">
                  {showFullComments 
                    ? inspection.comments 
                    : truncateText(inspection.comments)}
                </Text>
                {inspection.comments.length > 50 && (
                  <Button 
                    variant="subtle" 
                    size="xs" 
                    mt="xs"
                    onClick={() => setShowFullComments(!showFullComments)}
                  >
                    {showFullComments ? 'Show Less' : 'Show More'}
                  </Button>
                )}
              </Paper>
            </Card>
          </Stack>
        ) : !loading && (
          renderErrorState()
        )}
      </Container>
    </>
  );
} 