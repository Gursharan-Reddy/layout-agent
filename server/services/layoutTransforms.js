/**
 * Safe structural canvas multiplier scaling.
 * Recalculates precise absolute pixel locations using invariant normalized bounds.
 */
export function resizeArtboard(layout, newWidth, newHeight) {
  const updated = structuredClone(layout);
  const rootId = updated.rootNodes[0];
  const artboard = updated.nodes[rootId];

  artboard.width = newWidth;
  artboard.height = newHeight;

  artboard.children.forEach((childId) => {
    const node = updated.nodes[childId];
    if (!node) return;

    // Background elements remain locked to edge boundaries regardless of ratio variations
    if (node.name.toLowerCase().includes('background')) {
      node.nx = 0; node.ny = 0; node.nw = 1; node.nh = 1;
    }

    // Precise vector evaluation mappings
    node.x = Math.round(node.nx * newWidth);
    node.y = Math.round(node.ny * newHeight);
    node.width = Math.round(node.nw * newWidth);
    node.height = Math.round(node.nh * newHeight);
  });

  return updated;
}