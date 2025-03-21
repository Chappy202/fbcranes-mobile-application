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
  Flex
} from '@mantine/core';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
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
        <Title order={1} ta="center" mb="md">FB Cranes</Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          Mobile Inspection Application
        </Text>

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
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              radius="md"
              size="md"
            />

            <Button type="submit" radius="xl" fullWidth mt="xl" size="md">
              Sign in
            </Button>
          </Stack>
        </form>
      </Container>
    </Flex>
  );
} 