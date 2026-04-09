import './MotionToggle.css'

export default function MotionToggle({
  motionEnabled,
  motionSupported,
  motionUi,
  onToggle,
}) {
  return (
    <div className="motion-toggle" aria-live="polite">
      <button
        type="button"
        className={`motion-toggle-btn ${motionEnabled ? 'is-active' : ''}`}
        onClick={onToggle}
        aria-pressed={motionEnabled}
        disabled={!motionSupported && motionUi.title === 'Tilt unavailable'}
      >
        <span className="motion-toggle-title">{motionUi.title}</span>
        <span className="motion-toggle-detail">{motionUi.detail}</span>
      </button>
    </div>
  )
}
