import "@mantine/core/styles.css";
import { useState } from "react";
import { MantineProvider, ColorSchemeScript, Box } from "@mantine/core";
import { theme } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoginScreen } from "./screens/LoginScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { ResultsScreen } from "./screens/ResultsScreen";
import { Inspection, inspectionsService } from "./services/api";

type SearchMethod = 'serial' | 'tag';

function AppContent() {
  const { isAuthenticated, token } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'search' | 'results'>('search');
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('serial');
  const [searchValue, setSearchValue] = useState('');
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (value: string, method: SearchMethod) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    setSearchValue(value);
    setSearchMethod(method);
    
    try {
      let result: Inspection;
      
      if (method === 'serial') {
        result = await inspectionsService.getLatestBySerialNumber(value, token);
      } else {
        result = await inspectionsService.getLatestByTagNumber(value, token);
      }
      
      setInspection(result);
      setCurrentScreen('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inspection data');
      setInspection(null);
      setCurrentScreen('results');
    } finally {
      setLoading(false);
    }
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
        <SearchScreen 
          onSearch={handleSearch} 
          loading={loading} 
        />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen 
          inspection={inspection}
          loading={loading}
          error={error}
          searchMethod={searchMethod}
          searchValue={searchValue}
          onBack={handleBack} 
        />
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
