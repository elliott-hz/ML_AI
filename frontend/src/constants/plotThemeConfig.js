/**
 * plotThemeConfig — single source of truth for ALL plot-related colors.
 *
 * Levels:
 *   L1 — Shared constants like ASPECT_RATIO_OPTIONS
 *   L2 — Plot layout colors (bg, grid, axis, title, legend)
 *   L3 — Trace palette (main traces, aux traces, markers, text annotations)
 *
 * Import in plotters and page components instead of hardcoding hex values.
 */

// ──────────────────────────────────────────────
// L1: Shared constants
// ──────────────────────────────────────────────

export const ASPECT_RATIO_OPTIONS = ['auto', '16:9', '4:3', '1:1'];

// ──────────────────────────────────────────────
// L2: Plot layout colors
// ──────────────────────────────────────────────

/**
 * Returns the full Plotly layout colors object for the given theme mode.
 * Shared by all 4 plotters (DerivativePlotter, FunctionPlotter, LimitPlotter, ContinuityPlotter).
 */
export function getPlotLayout(themeMode) {
  const isDark = themeMode === 'dark';

  return {
    plot_bgcolor: isDark ? '#1e293b' : '#ffffff',
    paper_bgcolor: isDark ? '#1e293b' : '#ffffff',

    gridcolor: isDark ? '#334155' : '#cbd5e1',
    axisColor: isDark ? '#b9b9d3' : '#475569',
    zerolinecolor: isDark ? '#475569' : '#94a3b8',

    titleFontColor: isDark ? '#e0e0e0' : '#0f172a',
    tickFontColor: isDark ? '#94a3b8' : '#475569',
    axisLabelColor: isDark ? '#e0e0e0' : '#0f172a',

    legend: {
      fontColor: isDark ? '#e0e0e0' : '#0f172a',
      bgcolor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.85)',
      bordercolor: isDark ? '#334155' : '#cbd5e1',
    },

    containerBg: `var(--theme-card-bg, ${isDark ? '#1e293b' : '#ffffff'})`,
  };
}

// ──────────────────────────────────────────────
// L3: Trace / marker palette
// ──────────────────────────────────────────────

/**
 * Returns the semantic trace + marker color palette for the given theme mode.
 *
 * Categories:
 *   mainTraces   — solid-line function curves (theme-independent brand colors)
 *   auxTraces    — dashed auxiliary curves (derivative, secant, tangent)
 *   markers      — points, vertical lines, delta arrows
 *   text         — annotation labels (theme-dependent for readability)
 *   fills        — semi-transparent area fills
 */
export function getTracePalette(themeMode) {
  const isDark = themeMode === 'dark';

  return {
    // ── 3.1 Main traces (solid lines, theme-independent) ──
    mainTraces: {
      primary: '#6366f1',   // f(x), u(x), aˣ, sin x — indigo
      secondary: '#22c55e', // v(x), second function — green
      tertiary: '#f59e0b',  // third function if needed — amber
    },

    // ── 3.2 Auxiliary traces (dashed lines) ──
    auxTraces: {
      derivative: isDark ? '#facc15' : '#dc2626',   // f'(x) — red dashed
      secant: isDark ? '#22c55e' : '#16a34a',       // secant line — green dashed
      tangent: isDark ? '#06b6d4' : '#0891b2',      // tangent line — cyan dashed
      general: isDark ? '#ffd700' : '#b45309',  // generic aux — gold (dark) / amber (light)
      combined: isDark ? '#ef4444' : '#dc2626',     // combined function (u+v, u·v, u/v) — red
    },

    // ── 3.3 Markers / special elements ──
    markers: {
      pointA: isDark ? '#3b82f6' : '#2563eb',      // Point A — blue
      pointB: isDark ? '#ef4444' : '#dc2626',      // Point B — red
      evalX0: isDark ? '#f59e0b' : '#d97706',      // x₀ vertical line — amber
      deltaX: isDark ? '#3b82f6' : '#2563eb',      // Δx arrow / label — blue
      deltaY: isDark ? '#22c55e' : '#16a34a',      // Δy arrow / label — green
      tangentPoint: isDark ? '#06b6d4' : '#0891b2', // tangent point — cyan
    },

    // ── 3.3a Limit-specific semantic colors (theme-dependent) ──
    limit: {
      limitLine: isDark ? '#ffd700' : '#b45309',        // limit reference lines (horizontal/vertical dashed)
      leftLimit: isDark ? '#ef4444' : '#dc2626',        // left limit markers and labels
      rightLimit: isDark ? '#22c55e' : '#16a34a',       // right limit markers and labels
      verticalAsymptote: isDark ? '#ef4444' : '#dc2626', // vertical asymptote dotted lines
      hole: isDark ? '#ef4444' : '#dc2626',              // hole / discontinuity markers
      boundary: 'rgba(148,163,184,0.4)',                 // domain boundary faint dotted lines
    },

    // ── 3.3b Text annotations (theme-dependent) ──
    text: {
      annotation: isDark ? '#f8fafc' : '#0f172a',   // primary text labels
      muted: isDark ? '#94a3b8' : '#475569',        // secondary / axis labels
      formula: isDark ? '#e0e0e0' : '#0f172a',      // formula annotations
    },

    // ── 3.3c 3D surface colors ──
    surface: {
      colorscale: [
        [0, '#1e3a5f'],
        [0.25, '#2563eb'],
        [0.5, '#6366f1'],
        [0.75, '#a855f7'],
        [1, '#e879f9']
      ],
      planeProjection: [
        isDark ? '#f59e0b' : '#d97706',   // xy-plane projection — amber (evalX0)
        isDark ? '#22c55e' : '#16a34a',   // xz-plane projection — green (mainTraces.secondary)
        '#22d3ee'                          // yz-plane projection — cyan (theme-independent)
      ],
      contour: isDark ? '#94a3b8' : '#64748b',
      crossSection: {
        fx: isDark ? '#ffffff' : '#f8fafc',   // f(x) at y₀ — 白色
        fy: isDark ? '#facc15' : '#d97706',   // f(y) at x₀ — 金色/琥珀
      },
    },

    // ── 3.4 Fills (semi-transparent for area charts) ──
    fills: {
      primary: 'rgba(99, 102, 241, 0.15)',     // uv rectangle fill — indigo
      secondary: 'rgba(34, 197, 94, 0.35)',    // v strip fill — green
      accent: 'rgba(168, 85, 247, 0.4)',       // corner fill — purple
      highlight: 'rgba(250, 204, 21, 0.2)',    // highlight fill — yellow
      positive: 'rgba(34, 197, 94, 0.35)',     // positive contribution — green
      negative: 'rgba(239, 68, 68, 0.35)',     // negative contribution — red
    },
  };
}

// ──────────────────────────────────────────────
// Utility: single aux color
// ──────────────────────────────────────────────

/**
 * Returns the single auxiliary-element color for the given theme mode.
 * Unified to amber in light mode (avoids conflict with derivative #ef4444).
 */
export function getAuxiliaryColor(themeMode) {
  return themeMode === 'dark' ? '#ffd700' : '#b45309';
}
