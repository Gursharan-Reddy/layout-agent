export function validateLayout(layout) {
  if (!layout) {
    throw new Error('Schema ingestion error: Payload is null or undefined.');
  }
  if (!Array.isArray(layout.rootNodes) || layout.rootNodes.length === 0) {
    throw new Error('Schema validation error: Invalid or empty rootNodes index array mapping.');
  }
  if (typeof layout.nodes !== 'object' || layout.nodes === null) {
    throw new Error('Schema validation error: Structural nodes table lookup dictionary missing.');
  }

  // Structural sanity check validation loops
  for (const id of layout.rootNodes) {
    if (!layout.nodes[id]) {
      throw new Error(`Schema validation error: Reference index pointer [${id}] maps to non-existent nodes graph metadata.`);
    }
  }
  return true;
}