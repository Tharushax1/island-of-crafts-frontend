// Maps a category or craft-specialty name to a CSS pattern class,
// since there are no real product photos yet — this gives each
// craft type its own distinct, colorful visual identity.
export function craftVisualClass(name = '') {
  const n = name.toLowerCase();
  if (n.includes('batik') || n.includes('textile') || n.includes('fabric')) return 'batik';
  if (n.includes('wood')) return 'wood';
  if (n.includes('weave') || n.includes('basket') || n.includes('rattan')) return 'weave';
  return 'default';
}
