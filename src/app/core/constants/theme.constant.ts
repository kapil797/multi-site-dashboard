export interface Theme {
  ribbon: string;
  primary: string;
  secondary: string;
  tertiary: string;
}

export type ThemeKeys = 'option1' | 'option2';

export const ThemeConstant: { THEMES: Record<ThemeKeys, Theme> } = {
  THEMES: {
    option1: {
      ribbon: '#2985E2',
      primary: '#001626',
      secondary: '#1D3355',
      tertiary: '#254272',
    },
    option2: {
      ribbon: '#29B5E2',
      primary: '#09192F',
      secondary: '#002540',
      tertiary: '#1E3552',
    },
  },
};
