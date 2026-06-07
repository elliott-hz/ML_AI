import { ASPECT_RATIO_OPTIONS } from './plotThemeConfig';

export const plotStyleConfig = [
  { name: 'plotStyle', label: 'Plot Style', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] }
];

export const viewRangeConfig = [
  {
    name: 'xRange',
    label: 'X Range',
    type: 'range',
    min: -5,
    max: 5,
    step: 0.5,
    default: [-3, 3]
  },
  { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ASPECT_RATIO_OPTIONS }
];

export const legendPositionConfig = [
  { name: 'legendPosition', label: 'Legend Position', type: 'select', options: ['None', 'top-right', 'top-left', 'bottom-left', 'bottom-right'] }
];

export const commonParamsConfig = [
  ...legendPositionConfig,
  ...plotStyleConfig,
  ...viewRangeConfig
];
