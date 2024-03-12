import { Dropdown } from '@core/classes/form/form.class';

export const periods: Dropdown[] = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'HALF-YEARLY', 'YEARLY'].map(row => {
  return {
    text: row,
    value: row,
  };
});
