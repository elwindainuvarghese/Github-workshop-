import { useEffect, useRef, useState } from 'react'

export default function GlitchCursor() {
  const crossRef = useRef(null)
  const dotRef = useRef(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const move = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      if (crossRef.current) {
        crossRef.current.style.left = e.clientX + 'px'
        crossRef.current.style.top = e.clientY + 'px'
      }
    }
    const over = (e) => {
      const el = e.target
      const isClickable = el.closest('button, a, [role="button"], .team-card, .clickable')
      setHovering(!!isClickable)
    }
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={crossRef} className={`cursor-crosshair ${hovering ? 'hovering' : ''}`} />
    </>
  )
}
