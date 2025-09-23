let hasInjectedConnectorStyles = false

function injectConnectorGlobalStyles() {
  if (hasInjectedConnectorStyles) return
  if (typeof document === 'undefined') return

  const style = document.createElement('style')
  style.setAttribute('data-connector-styles', 'true')
  style.textContent = `
/* ConnectorKit Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translate(-50%, -45%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus ring utilities */
.connector-focus-ring {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading shimmer effect */
.connector-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
`
  document.head.appendChild(style)
  hasInjectedConnectorStyles = true
}

// Initialize immediately in the browser so animations are available
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  injectConnectorGlobalStyles()
}

export { injectConnectorGlobalStyles }

// Legacy export for backwards compatibility
export { injectConnectorGlobalStyles as injectArcConnectorGlobalStyles }


