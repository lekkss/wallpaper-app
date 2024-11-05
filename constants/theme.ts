type ThemeColors = {
  white: string;
  black: string;
  grayBg: string;
  neutral: (opacity: number) => string;
};

type FontWeights = {
  medium: number;
  semiBold: number;
  bold: number;
};

type Radius = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

// Define the theme type
interface Theme {
  colors: ThemeColors;
  fontWeights: FontWeights;
  radius: Radius;
}

// Now create the theme object with the Theme type
export const theme: Theme = {
  colors: {
    white: "#fff",
    black: "#000",
    grayBg: "#e5e5e5",
    neutral: (opacity: number) => `rgba(10, 10, 10, ${opacity})`,
  },
  fontWeights: {
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  },
};
