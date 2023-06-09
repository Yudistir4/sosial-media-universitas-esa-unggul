import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};
// 2. Extend the theme to include custom colors, fonts, etc

export const theme = extendTheme(
  { config },
  {
    breakpoints: {
      sm: '0px',
      md: '600px',
      lg: '800px',
      xl: '1000px',
      '2xl': '1280px',
      '3xl': '1560px',
    },
    colors: {
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
      },
    },
    //   styles: {
    //     global: () => ({
    //       body: {
    //         bg: 'whiteAlpha.200',
    //       },
    //     }),
    //   },
  }
);
