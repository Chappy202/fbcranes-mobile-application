import "@mantine/core/styles.css";
import { useState } from "react";
import { MantineProvider, ColorSchemeScript, Box } from "@mantine/core";
import { theme } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoginScreen } from "./screens/LoginScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { ResultsScreen } from "./screens/ResultsScreen";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'search' | 'results'>('search');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentScreen('results');
  };

  const handleBack = () => {
    setCurrentScreen('search');
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <Box>
      {currentScreen === 'search' && (
        <SearchScreen onSearch={handleSearch} />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen query={searchQuery} onBack={handleBack} />
      )}
    </Box>
  );
}

export default function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </MantineProvider>
    </>
  );
}
