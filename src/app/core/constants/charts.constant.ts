// For manipulating the styles directly through JS objects.
// Angular has built-in DomSanitizer for preventing XSS.
// Colors must match with styles defined in core module.
export const chartConfig = {
  backgroundColor: '#002135',
  color: '#ffffff',
  success: '#21d794',
  warning: '#fab95c',
  error: '#F24D4D',
  neutral: '#bdbdbd',
  dateFormats: {
    time: 'HH:mm:ss',
    day: 'DD/MM/YYYY',
  },
};
