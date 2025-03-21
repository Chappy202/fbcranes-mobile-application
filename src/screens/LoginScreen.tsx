import { useState } from 'react';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Container, 
  Stack,
  Text,
  Box,
  Flex,
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      await login(username, password);
    }
  };

  return (
    <Flex
      h="100vh"
      direction="column"
      align="center"
      justify="center"
      px="md"
    >
      <Container size="xs" px="sm" w="100%">
        <Title order={1} ta="center" mb="md">{APP_NAME}</Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          Mobile Inspection Application
        </Text>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Authentication Error" 
            color="red" 
            mb="md"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              required
              label="Username"
              placeholder="Your username"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
              radius="md"
              size="md"
              disabled={loading}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              radius="md"
              size="md"
              disabled={loading}
            />

            <Button 
              type="submit" 
              radius="xl" 
              fullWidth 
              mt="xl" 
              size="md"
              loading={loading}
              disabled={!username.trim() || !password.trim() || loading}
            >
              Sign in
            </Button>
          </Stack>
        </form>
      </Container>
    </Flex>
  );
} 