/**
 * Utility functions for color manipulation and Neumorphic shadow calculations.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts a HEX color string to an RGB object.
 */
export function hexToRgb(hex: string): RGB {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Converts RGB values to a HEX color string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lightens a color by a given intensity (0 to 1).
 * Uses a multiplicative approach as requested in the example.
 */
export function lighten(hex: string, intensity: number): string {
  const { r, g, b } = hexToRgb(hex);
  // Example: #8f2d2d (143, 45, 45) -> #b33838 (179, 56, 56) is ~25% increase
  // We use 1 + intensity as a multiplier, capped at 255
  return rgbToHex(
    Math.min(255, r * (1 + intensity)),
    Math.min(255, g * (1 + intensity)),
    Math.min(255, b * (1 + intensity))
  );
}

/**
 * Darkens a color by a given intensity (0 to 1).
 * Uses a multiplicative approach as requested in the example.
 */
export function darken(hex: string, intensity: number): string {
  const { r, g, b } = hexToRgb(hex);
  // Example: #8f2d2d (143, 45, 45) -> #6b2222 (107, 34, 34) is ~25% decrease
  return rgbToHex(
    r * (1 - intensity),
    g * (1 - intensity),
    b * (1 - intensity)
  );
}

/**
 * Converts RGB to HSV.
 */
export function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, v };
}

/**
 * Converts HSV to RGB.
 */
export function hsvToRgb(h: number, s: number, v: number): RGB {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Determines the best contrast color (black or white) for a given background hex.
 */
export function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  // YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

/**
 * Calculates the relative luminance of a color.
 */
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates the contrast ratio between two colors.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks accessibility based on WCAG standards and Neumorphic shadow contrast.
 */
export function checkAccessibility(baseColor: string, textColor: string, intensity: number) {
  const contrastRatio = getContrastRatio(baseColor, textColor);
  
  // WCAG 2.1 levels
  let level: 'AAA' | 'AA' | 'Alert' = 'Alert';
  if (contrastRatio >= 7) level = 'AAA';
  else if (contrastRatio >= 4.5) level = 'AA';

  // Neumorphic shadow contrast check
  // Intensity is the luminosity difference essentially in our multiplicative model
  const shadowContrastAlert = intensity < 0.15;

  return {
    contrastRatio: contrastRatio.toFixed(2),
    level,
    shadowContrastAlert
  };
}

/**
 * Calculates the Neumorphic shadows based on base color, intensity, distance, blur, and direction.
 */
export function calculateShadows(
  color: string,
  intensity: number,
  distance: number,
  blur: number,
  direction: 'tl' | 'tr' | 'bl' | 'br',
  shape: 'flat' | 'concave' | 'convex' | 'pressed'
) {
  const lightColor = lighten(color, intensity);
  const darkColor = darken(color, intensity);

  let x: number, y: number;

  switch (direction) {
    case 'tl':
      x = distance;
      y = distance;
      break;
    case 'tr':
      x = -distance;
      y = distance;
      break;
    case 'bl':
      x = distance;
      y = -distance;
      break;
    case 'br':
      x = -distance;
      y = -distance;
      break;
    default:
      x = distance;
      y = distance;
  }

  const isPressed = shape === 'pressed';
  const inset = isPressed ? 'inset ' : '';

  // For pressed, we swap the shadows to create the "inner" effect correctly
  // and use the same offsets but with inset
  if (isPressed) {
    return `${inset}${x}px ${y}px ${blur}px ${darkColor}, ${inset}${-x}px ${-y}px ${blur}px ${lightColor}`;
  }

  return `${x}px ${y}px ${blur}px ${darkColor}, ${-x}px ${-y}px ${blur}px ${lightColor}`;
}

/**
 * Calculates the background gradient for concave and convex shapes.
 */
export function calculateBackground(
  color: string,
  intensity: number,
  shape: 'flat' | 'concave' | 'convex' | 'pressed',
  direction: 'tl' | 'tr' | 'bl' | 'br'
): string {
  if (shape === 'flat' || shape === 'pressed') return color;

  const lightColor = lighten(color, intensity);
  const darkColor = darken(color, intensity);

  let angle: string;
  switch (direction) {
    case 'tl': angle = '145deg'; break;
    case 'tr': angle = '225deg'; break;
    case 'bl': angle = '45deg'; break;
    case 'br': angle = '315deg'; break;
    default: angle = '145deg';
  }

  if (shape === 'concave') {
    return `linear-gradient(${angle}, ${darkColor}, ${lightColor})`;
  } else {
    // convex
    return `linear-gradient(${angle}, ${lightColor}, ${darkColor})`;
  }
}
