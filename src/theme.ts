import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Roboto, sans-serif',
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        size: 'md'
      }
    },
    Paper: {
      defaultProps: {
        shadow: 'xs'
      }
    }
  }
});
