import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current!
    const scene = new THREE.Scene()

    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    container.appendChild(renderer.domElement)

    const geometry = new THREE.TorusKnotGeometry(0.8, 0.25, 128, 32)
    const material = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.4, metalness: 0.3 })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
    scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(5, 5, 5)
    scene.add(dir)

    const clock = new THREE.Clock()
    let rafId = 0

    function animate() {
      const t = clock.getElapsedTime()
      mesh.rotation.x = t * 0.3
      mesh.rotation.y = t * 0.5
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    animate()

    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geometry.dispose()
      ;(material as THREE.Material).dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} style={{ width: '420px', height: '320px' }} />
}
