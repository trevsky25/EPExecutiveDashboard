'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Annotation } from '@/data/annotations';

const TYPE_COLORS: Record<Annotation['type'], string> = {
  policy: '#3b82f6',
  campaign: '#10b981',
  outage: '#ef4444',
  milestone: '#8b5cf6',
};

type AnnotationDotProps = {
  cx?: number;
  cy?: number;
  annotation: Annotation;
};

export default function AnnotationDot({ cx, cy, annotation }: AnnotationDotProps) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (cx == null || cy == null) return null;

  const color = TYPE_COLORS[annotation.type];
  const size = 6;

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Diamond shape (rotated square) */}
      <rect
        x={cx - size}
        y={cy - size}
        width={size * 2}
        height={size * 2}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
        transform={`rotate(45, ${cx}, ${cy})`}
      />

      {/* Portal-based tooltip */}
      {hovered && mounted && createPortal(
        <div
          style={{
            position: 'fixed',
            left: cx,
            top: cy - 12,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: 8,
              padding: '10px 14px',
              maxWidth: 260,
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: color,
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 600, fontSize: 12 }}>{annotation.label}</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>{annotation.description}</div>
          </div>
          {/* Triangle pointer */}
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1e293b',
              margin: '0 auto',
            }}
          />
        </div>,
        document.body
      )}
    </g>
  );
}
