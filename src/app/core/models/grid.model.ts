import { NumberFormatOptions } from '@progress/kendo-angular-intl';

export interface ColumnSetting {
  field: string;
  title: string;
  format?: NumberFormatOptions;
  width?: number;
  editable?: boolean;
}

export const getWidth = (v: number | undefined) => {
  return v as number;
};
