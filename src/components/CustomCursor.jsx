import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const outlineRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const outline = outlineRef.current
    if (!dot || !outline) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let outlineX = mouseX
    let outlineY = mouseY

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top = `${mouseY}px`
    }

    const animate = () => {
      // Ease outline towards mouse
      outlineX += (mouseX - outlineX) * 0.15
      outlineY += (mouseY - outlineY) * 0.15
      
      if (outline) {
        outline.style.left = `${outlineX}px`
        outline.style.top = `${outlineY}px`
      }
      requestAnimationFrame(animate)
    }

    const addHover = () => document.body.classList.add('cursor-hover')
    const removeHover = () => document.body.classList.remove('cursor-hover')

    // Attach to clickable elements dynamically
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .clickable, .agency-card, input')) {
        addHover()
      }
    }
    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, .clickable, .agency-card, input')) {
        removeHover()
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    
    let animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={outlineRef} className="cursor-outline" />
    </>
  )
}
