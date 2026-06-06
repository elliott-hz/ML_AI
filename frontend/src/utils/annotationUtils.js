/**
 * createDataAnnotation — create a Plotly annotation that floats next to a data point.
 *
 * The annotation is anchored at (x, y) in data coordinates, then shifted
 * `xshift` pixels to the right, so it always stays adjacent to the marker
 * regardless of zoom/pan.
 *
 * @param {Object} opts
 * @param {number} opts.x          — data x
 * @param {number} opts.y          — data y
 * @param {string} opts.text       — label text
 * @param {string} opts.color      — font & border color
 * @param {string} [opts.plotStyle='medium'] — 'thin'|'medium'|'thick'|'extra-thick'
 * @param {string} [opts.themeMode='light']  — 'light'|'dark'
 * @param {number} [opts.xshift=14]          — pixel offset to the right of anchor
 * @param {number} [opts.fontSize]           — override auto font size
 * @param {number} [opts.borderWidth]        — override auto border width
 * @returns {Object} Plotly annotation config
 */
export function createDataAnnotation({
  x, y, text, color,
  plotStyle = 'medium',
  themeMode = 'light',
  xshift = 14,
  fontSize: fontSizeOverride,
  borderWidth: borderWidthOverride,
}) {
  // Keep in sync with DerivativePlotter's styleConfig
  const FONT_SIZE_MAP = { thin: 10, medium: 12, thick: 16, 'extra-thick': 18 };
  const BORDER_WIDTH_MAP = { thin: 0.5, medium: 1, thick: 1.5, 'extra-thick': 2 };

  const fontSize = fontSizeOverride ?? (FONT_SIZE_MAP[plotStyle] || 12);
  const borderWidth = borderWidthOverride ?? (BORDER_WIDTH_MAP[plotStyle] || 1);

  const bg = themeMode === 'dark'
    ? 'rgba(30,41,59,0.85)'
    : 'rgba(255,255,255,0.85)';

  return {
    x, y,
    xref: 'x',
    yref: 'y',
    xanchor: 'left',
    xshift,
    showarrow: false,
    text,
    font: { color, size: fontSize, family: 'monospace' },
    bgcolor: bg,
    bordercolor: color,
    borderwidth: borderWidth,
    borderpad: 3,
  };
}

/**
 * applyAnnotationBorderRadius — round the corners of all annotation
 * background rects in a Plotly graph div.
 *
 * Run this after Plotly.newPlot / Plotly.react / Plotly.Plots.resize
 * (e.g. from a `plotly_afterplot` handler).
 *
 * @param {HTMLElement} gd — the Plotly graph div (plotRef.current)
 * @param {number}      [radius=6] — border-radius in px
 */
export function applyAnnotationBorderRadius(gd, radius = 6) {
  if (!gd) return;
  gd.querySelectorAll('g > rect').forEach(rect => {
    const parent = rect.parentElement;
    if (parent && parent.querySelector('text')) {
      rect.setAttribute('rx', String(radius));
      rect.setAttribute('ry', String(radius));
    }
  });
}
