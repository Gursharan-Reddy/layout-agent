import React from 'react';

export default function WireframePreview({ layout }) {
  const rootId = layout?.rootNodes?.[0];
  const artboard = layout?.nodes?.[rootId];

  if (!artboard) {
    return <div style={{ padding: '32px', color: '#64748b' }}>Missing Canvas Context</div>;
  }

  const aspectRatio = artboard.height / artboard.width;

  return (
    <div style={{
      backgroundColor: '#0f172a',
      border: '1px solid #1e293b',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      height: '52vh', 
      minHeight: '360px',
      boxSizing: 'border-box'
    }}>
      {/* Dynamic Header Badge Meta */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '12px',
        color: '#94a3b8'
      }}>
        <span style={{ fontWeight: 'bold', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          INTERACTIVE CANVAS PREVIEW
        </span>
        <span style={{
          backgroundColor: '#1e293b',
          padding: '4px 8px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          color: '#38bdf8'
        }}>
          {artboard.width} × {artboard.height} px ({aspectRatio > 1 ? 'Vertical' : aspectRatio < 1 ? 'Horizontal' : 'Square'})
        </span>
      </div>

      {/* Viewport Box Wrapper */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(2, 6, 23, 0.4)',
        borderRadius: '8px',
        padding: '16px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          style={{
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            height: '100%',
            aspectRatio: `${artboard.width} / ${artboard.height}`,
            backgroundColor: artboard.data?.backgroundColor || '#1e1b4b',
            border: '2px dashed #475569',
            boxSizing: 'border-box'
          }}
        >
          {artboard.children?.map((id) => {
            const node = layout.nodes[id];
            if (!node) return null;

            const isImg = node.type === 'image';
            const isTxt = node.type === 'text';
            const bg = isImg ? 'rgba(59,130,246,0.15)' : isTxt ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
            const border = isImg ? '#3b82f6' : isTxt ? '#f59e0b' : '#ef4444';

            return (
              <div
                key={id}
                style={{
                  position: 'absolute',
                  left: `${node.nx * 100}%`,
                  top: `${node.ny * 100}%`,
                  width: `${node.nw * 100}%`,
                  height: `${node.nh * 100}%`,
                  backgroundColor: bg,
                  border: `1px solid ${border}`,
                  boxSizing: 'border-box',
                  padding: '4px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{
                  backgroundColor: '#020617',
                  color: '#cbd5e1',
                  fontSize: '8px',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  width: 'max-content',
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {node.name}
                </span>

                {node.data?.content && (
                  <div style={{
                    fontSize: '11px',
                    color: '#ffffff',
                    fontWeight: '500',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                  }}>
                    {node.data.content}
                  </div>
                )}

                <div style={{ fontSize: '7px', fontFamily: 'monospace', color: '#94a3b8' }}>
                  {node.width}×{node.height}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}