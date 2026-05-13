// Shared gradient palette (matches /src/pages/index.astro home tiles).
export const palette = [
  'linear-gradient(135deg, #d4c4a8, #9a8568)',
  'linear-gradient(135deg, #e8e2d4, #a89c8a 60%, #4a4238)',
  'radial-gradient(circle at 40% 30%, #d8d0c0, #8a8275)',
  'linear-gradient(180deg, #c4b8a8, #6a5a4a 60%, #2a2520)',
  'linear-gradient(0deg, #b0a8a0, #d4ccc4)',
  'linear-gradient(150deg, #5a5856, #8a8782 60%, #c0bdb8)',
  'radial-gradient(circle at 70% 60%, #6a5a4a, #2a2520)',
  'linear-gradient(135deg, #c8b8a8, #8a7868 60%, #4a3828)',
];

export function gradientFor(key = '') {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}
