export const plotStyleConfig = [
  { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
];

export const legendPositionConfig = [
  { name: 'legendPosition', label: 'Legend Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
];

export const viewRangeConfig = (defaultRange = [-3, 3]) => ([
  {
    name: 'xRange', label: 'X Range', type: 'range',
    min: -10, max: 10, step: 1, default: defaultRange
  }
]);
