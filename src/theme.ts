import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Roboto, sans-serif',
  defaultRadius: 'md',
  components: {
    Container: {
      defaultProps: {
        px: rem(16)
      }
    },
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
