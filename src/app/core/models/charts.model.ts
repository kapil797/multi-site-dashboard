import { LegendItemVisualArgs } from '@progress/kendo-angular-charts';
import { Rect as RectShape, Text, Group, Path, geometry } from '@progress/kendo-drawing';

const { Point, Rect, Size } = geometry;

export interface SeriesDataItem {
  xValue?: string | number;
  yValue: number;
  color: string;
}

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

export function constructLineLegend(args: LegendItemVisualArgs) {
  // Create the lines used to represent the custom legend item
  const pathColor = args.options.markers.border.color;
  const path1 = new Path({
    stroke: {
      color: pathColor,
      width: 3,
    },
  });

  // The paths are constructed by using a chain of commands
  path1.moveTo(0, 7).lineTo(10, 7).close();

  // Create the text associated with the legend item
  const labelText = args.series.name;
  const labelFont = args.options.labels.font;
  const fontColor = chartConfig.color;
  const textOptions = { font: labelFont, fill: { color: fontColor } };
  const text = new Text(labelText, new Point(20, 0), textOptions);

  // Place all the shapes in a group
  const group = new Group();

  group.append(path1, text);

  // set opacity if the legend item is disabled
  if (!args.active) {
    group.opacity(0.5);
  }

  return group;
}

export function constructDottedLineLegend(args: LegendItemVisualArgs) {
  // Create the lines used to represent the custom legend item
  const pathColor = args.options.markers.border.color;
  const path1 = new Path({
    stroke: {
      color: pathColor,
      width: 3,
    },
  });

  const path2 = new Path({
    stroke: {
      color: pathColor,
      width: 3,
    },
  });

  const path3 = new Path({
    stroke: {
      color: pathColor,
      width: 3,
    },
  });

  // The paths are constructed by using a chain of commands
  path1.moveTo(0, 7).lineTo(10, 7).close();
  path2.moveTo(15, 7).lineTo(25, 7).close();
  path3.moveTo(30, 7).lineTo(40, 7).close();

  // Create the text associated with the legend item
  const labelText = args.series.name;
  const labelFont = args.options.labels.font;
  const fontColor = chartConfig.color;
  const textOptions = { font: labelFont, fill: { color: fontColor } };
  const text = new Text(labelText, new Point(50, 0), textOptions);

  // Place all the shapes in a group
  const group = new Group();

  group.append(path1, path2, path3, text);

  // set opacity if the legend item is disabled
  if (!args.active) {
    group.opacity(0.5);
  }

  return group;
}

export function constructAreaLegend(args: LegendItemVisualArgs) {
  const rectColor = args.options.markers.border.color;
  const rectOptions = {
    fill: { color: rectColor, opacity: 0.3 },
  };
  const rectGeometry = new Rect(new Point(0, 0), new Size(20, 15));
  const rect: RectShape = new RectShape(rectGeometry, rectOptions);

  // Create the text associated with the legend item
  const labelText = args.series.name;
  const labelFont = args.options.labels.font;
  const fontColor = chartConfig.color;
  const textOptions = { font: labelFont, fill: { color: fontColor } };
  const text = new Text(labelText, new Point(30, 0), textOptions);

  // Place all the shapes in a group
  const group = new Group();

  group.append(rect, text);

  // set opacity if the legend item is disabled
  if (!args.active) {
    group.opacity(0.5);
  }

  return group;
}
