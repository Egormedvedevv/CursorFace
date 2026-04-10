import './MotionToggle.css'

function MotionGlyph({ variant }) {
  let iconName = 'bolt'
  let modifierClass = ''
  switch (variant) {
    case 'active':
      iconName = 'bolt-solid'
      modifierClass = ' motion-toggle-icon--active'
      break
    case 'pending':
    case 'requesting':
      iconName = 'circle-notch-solid'
      modifierClass = ' motion-toggle-icon--spinning'
      break
    case 'blocked':
    case 'error':
      iconName = 'exclamation-triangle-solid'
      modifierClass = ' motion-toggle-icon--warning'
      break
    case 'unsupported':
      iconName = 'info-circle-solid'
      modifierClass = ' motion-toggle-icon--muted'
      break
  }

  return (
    <i
      aria-hidden="true"
      className={`hn hn-${iconName} motion-toggle-icon${modifierClass}`}
    />
  )
}

export default function MotionToggle({
  motionEnabled,
  motionUi,
  onToggle,
}) {
  return (
    <div className="motion-toggle" aria-live="polite">
      <button
        type="button"
        className={`motion-toggle-btn motion-toggle-btn--${motionUi.variant} ${motionEnabled ? 'is-active' : ''}`}
        onClick={onToggle}
        aria-pressed={motionEnabled}
        aria-label={motionUi.label}
        title={motionUi.label}
        disabled={motionUi.disabled}
      >
        <MotionGlyph variant={motionUi.variant} />
        <span className="sr-only">{motionUi.label}</span>
      </button>
    </div>
  )
}
