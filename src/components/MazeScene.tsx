import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

function generateMaze(width: number, height: number) {
  // width and height should be odd
  const grid: number[][] = []
  for (let y = 0; y < height; y++) {
    grid[y] = []
    for (let x = 0; x < width; x++) grid[y][x] = 1
  }

  const dirs = [
    [0, -2],
    [2, 0],
    [0, 2],
    [-2, 0]
  ]

  function shuffle(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
  }

  function carve(x: number, y: number) {
    grid[y][x] = 0
    const d = [...dirs]
    shuffle(d)
    for (const [dx, dy] of d) {
      const nx = x + dx
      const ny = y + dy
      if (ny > 0 && ny < height && nx > 0 && nx < width && grid[ny][nx] === 1) {
        grid[y + dy / 2][x + dx / 2] = 0
        carve(nx, ny)
      }
    }
  }

  carve(1, 1)
  return grid
}

function bfsPath(grid: number[][], start: [number, number], end: [number, number]) {
  const h = grid.length
  const w = grid[0].length
  const queue: [number, number][] = [start]
  const seen = new Array(h).fill(0).map(() => new Array(w).fill(false))
  const parent: (null | [number, number])[][] = new Array(h).fill(0).map(() => new Array(w).fill(null))
  seen[start[1]][start[0]] = true
  while (queue.length) {
    const [x, y] = queue.shift() as [number, number]
    if (x === end[0] && y === end[1]) break
    const moves = [ [1,0], [-1,0], [0,1], [0,-1] ]
    for (const [dx, dy] of moves) {
      const nx = x + dx, ny = y + dy
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !seen[ny][nx] && grid[ny][nx] === 0) {
        seen[ny][nx] = true
        parent[ny][nx] = [x,y]
        queue.push([nx,ny])
      }
    }
  }
  const path: [number, number][] = []
  if (!parent[end[1]][end[0]]) return path
  let cur: any = end
  while (cur) {
    path.push(cur)
    cur = parent[cur[1]][cur[0]]
  }
  return path.reverse()
}

export default function MazeScene() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = mountRef.current!
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = THREE.sRGBEncoding
    container.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 40, 50)
    camera.lookAt(0, 0, 0)

    const ambient = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(5, 10, 7)
    scene.add(dir)

    // Maze parameters
    const cols = 51 // must be odd
    const rows = 31 // must be odd
    const grid = generateMaze(cols, rows)
    const cellSize = 1

    // Create floor grid for subtle visual
    const gridHelper = new THREE.GridHelper(cols * cellSize, cols, 0x222222, 0x2b2b2b)
    gridHelper.position.y = -0.5
    scene.add(gridHelper)

    // Walls instanced mesh
    const wallGeo = new THREE.BoxGeometry(cellSize, 1.6, cellSize)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x111827 })
    const wallPositions: THREE.Vector3[] = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x] === 1) {
          const px = (x - cols / 2) * cellSize 
          const pz = (y - rows / 2) * cellSize
          wallPositions.push(new THREE.Vector3(px, 0.8, pz))
        }
      }
    }
    const walls = new THREE.InstancedMesh(wallGeo, wallMat, wallPositions.length)
    walls.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    const dummy = new THREE.Object3D()
    wallPositions.forEach((p, i) => {
      dummy.position.copy(p)
      dummy.updateMatrix()
      walls.setMatrixAt(i, dummy.matrix)
    })
    scene.add(walls)

    // Pathfinding: find path from top-left to bottom-right (nearest open cells)
    const start = [1,1]
    const end = [cols - 2, rows - 2]
    const path = bfsPath(grid, start, end)

    // Path instanced mesh (highlight)
    const pathGeo = new THREE.BoxGeometry(cellSize * 0.9, 0.6, cellSize * 0.9)
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 0.3 })
    const pathMesh = new THREE.InstancedMesh(pathGeo, pathMat, Math.max(1, path.length))
    pathMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(pathMesh)

    // place path instances but initially scale to zero
    const pathDummy = new THREE.Object3D()
    for (let i = 0; i < path.length; i++) {
      const [px, py] = path[i]
      const wx = (px - cols / 2) * cellSize
      const wz = (py - rows / 2) * cellSize
      pathDummy.position.set(wx, 0.3, wz)
      pathDummy.scale.setScalar(0.001)
      pathDummy.updateMatrix()
      pathMesh.setMatrixAt(i, pathDummy.matrix)
    }
    pathMesh.count = path.length
    pathMesh.instanceMatrix.needsUpdate = true

    // animate path reveal
    let reveal = 0
    const revealSpeed = 0.5 // nodes per frame-ish

    // subtle camera orbit
    let t = 0

    function animate() {
      t += 0.002
      const camX = Math.sin(t) * 20
      const camZ = Math.cos(t) * 28
      camera.position.x += (camX - camera.position.x) * 0.02
      camera.position.z += (camZ - camera.position.z) * 0.02
      camera.lookAt(0, 0, 0)

      // reveal path gradually
      if (reveal < path.length) {
        reveal += revealSpeed
        const upto = Math.floor(reveal)
        for (let i = 0; i < upto && i < path.length; i++) {
          const [px, py] = path[i]
          const wx = (px - cols / 2) * cellSize
          const wz = (py - rows / 2) * cellSize
          pathDummy.position.set(wx, 0.3, wz)
          pathDummy.scale.setScalar(1)
          pathDummy.updateMatrix()
          pathMesh.setMatrixAt(i, pathDummy.matrix)
        }
        pathMesh.instanceMatrix.needsUpdate = true
      }

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    function onResize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      scene.clear()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="background-canvas" />
}
