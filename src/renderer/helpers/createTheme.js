import { createMuiTheme } from 'material-ui/styles';

export default function createTheme(palette) {
  const initialTheme = {
    overrides: {
      // Fixes for custom title bar
      MuiModal: {
        root: {
          top: 29
        }
      },
      MuiBackdrop: {
        root: {
          top: 'auto'
        }
      },
      MuiDrawer: {
        paper: {
          top: 'auto'
        }
      },

      MuiToolbar: {
        root: {
          minHeight: 64,
          maxHeight: 64
        }
      },
    }
  };

  const test = {
    palette: {
      type: palette.toLowerCase()
    },
    ...initialTheme
  };

  console.log(test);

  return createMuiTheme(test);
}