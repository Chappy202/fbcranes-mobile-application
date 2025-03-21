import { Group, Menu, rem, Box, Avatar, Text } from '@mantine/core';
import { IconSun, IconMoonStars, IconLogout } from '@tabler/icons-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { toggleColorScheme, isDarkMode } = useTheme();
  const { logout } = useAuth();

  return (
    <Box 
      py="md" 
      px="md" 
      style={(theme) => ({
        borderBottom: `1px solid ${
          isDarkMode ? theme.colors.dark[4] : theme.colors.gray[3]
        }`,
        backgroundColor: isDarkMode ? theme.colors.dark[7] : theme.white,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      })}
    >
      <Group justify="space-between">
        <Text fw={700} size="lg">FB Cranes</Text>
        <Menu position="bottom-end" withArrow shadow="md" zIndex={1000}>
          <Menu.Target>
            <Avatar
              radius="xl"
              size="md"
              color="blue"
              src={null}
              alt="User avatar"
              style={{ cursor: 'pointer' }}
            >
              FB
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item
              leftSection={
                isDarkMode ? (
                  <IconSun style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                ) : (
                  <IconMoonStars style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                )
              }
              onClick={toggleColorScheme}
            >
              {isDarkMode ? 'Light mode' : 'Dark mode'}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              onClick={logout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
} 