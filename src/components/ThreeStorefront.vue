<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'

interface StoreCategory {
  id: string
  name: string
  productCount: number
}

const props = defineProps<{
  categories: StoreCategory[]
  activeIndex: number
}>()

const mountPoint = ref<HTMLDivElement | null>(null)
const unavailable = ref(false)

let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let camera: THREE.PerspectiveCamera | undefined
let stack: THREE.Group | undefined
let folderGroups: THREE.Group[] = []
let geometries: THREE.BufferGeometry[] = []
let materials: THREE.Material[] = []
let textures: THREE.Texture[] = []
let resizeObserver: ResizeObserver | undefined
let animationFrame: number | undefined
let motionPreference: MediaQueryList | undefined
let reducedMotion = false
let pointerDown = false
let previousPointer = { x: 0, y: 0 }
let targetRotation = { x: -0.08, y: -0.13 }
let lastFrame = 0

function trackGeometry<T extends THREE.BufferGeometry>(geometry: T): T {
  geometries.push(geometry)
  return geometry
}

function trackMaterial<T extends THREE.Material>(material: T): T {
  materials.push(material)
  return material
}

function createLabelTexture(category: StoreCategory, selected: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D context is unavailable for category labels')

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = selected ? '#ffffff' : '#1d1d1f'
  let fontSize = 72
  context.font = `500 ${fontSize}px "Manrope", sans-serif`
  while (context.measureText(category.name).width > 900 && fontSize > 42) {
    fontSize -= 2
    context.font = `500 ${fontSize}px "Manrope", sans-serif`
  }
  context.fillText(category.name, 52, 276)
  context.globalAlpha = 0.82
  context.font = '500 36px "Manrope", sans-serif'
  context.fillText(`${category.productCount} SẢN PHẨM MẪU`, 54, 350)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 1
  textures.push(texture)
  return texture
}

function updateSelection() {
  folderGroups.forEach((folder, index) => {
    const active = index === props.activeIndex
    const baseY = (1 - Math.floor(index / 2)) * 1.58
    const baseZ = (index % 2) * 0.08
    folder.userData.targetY = baseY + (active ? 0.12 : 0)
    folder.userData.targetZ = baseZ + (active ? 0.28 : 0)
    if (reducedMotion) {
      folder.position.y = Number(folder.userData.targetY)
      folder.position.z = Number(folder.userData.targetZ)
    }

    const board = folder.children[0]
    const label = folder.children[2]
    if (board instanceof THREE.Mesh) {
      const material = board.material
      if (material instanceof THREE.MeshStandardMaterial) material.color.set(active ? '#0066cc' : '#f5f5f7')
    }
    if (label instanceof THREE.Mesh) {
      const material = label.material
      if (material instanceof THREE.MeshBasicMaterial) {
        const oldTexture = material.map
        material.map = createLabelTexture(props.categories[index], active)
        material.needsUpdate = true
        if (oldTexture) {
          textures = textures.filter((texture) => texture !== oldTexture)
          oldTexture.dispose()
        }
      }
    }
  })
}

function addFolder(category: StoreCategory, index: number) {
  const folder = new THREE.Group()
  const boardMaterial = trackMaterial(new THREE.MeshStandardMaterial({
    color: index === props.activeIndex ? '#0066cc' : '#f5f5f7',
    roughness: 0.72,
    metalness: 0.05,
  }))
  const board = new THREE.Mesh(trackGeometry(new THREE.BoxGeometry(2.55, 1.42, 0.16)), boardMaterial)
  folder.add(board)

  const tabMaterial = trackMaterial(new THREE.MeshStandardMaterial({
    color: '#0066cc',
    roughness: 0.7,
    metalness: 0.1,
  }))
  const tab = new THREE.Mesh(trackGeometry(new THREE.BoxGeometry(0.94, 0.18, 0.13)), tabMaterial)
  tab.position.set(-0.74, 0.79, 0)
  folder.add(tab)

  const labelMaterial = trackMaterial(new THREE.MeshBasicMaterial({
    map: createLabelTexture(category, index === props.activeIndex),
    transparent: true,
    depthWrite: false,
  }))
  const label = new THREE.Mesh(trackGeometry(new THREE.PlaneGeometry(2.4, 1.2)), labelMaterial)
  label.position.set(0, -0.04, 0.09)
  folder.add(label)

  const row = Math.floor(index / 2)
  const column = index % 2
  folder.position.set(column === 0 ? -1.34 : 1.34, (1 - row) * 1.58, column * 0.08)
  folder.rotation.z = column === 0 ? 0.018 : -0.018
  folder.userData.targetY = folder.position.y
  folder.userData.targetZ = folder.position.z
  folderGroups.push(folder)
  stack?.add(folder)
}

function renderFrame(timestamp = 0) {
  if (!renderer || !scene || !camera || !stack) return
  if (!reducedMotion && timestamp - lastFrame >= 1000 / 30) {
    stack.rotation.x += (targetRotation.x - stack.rotation.x) * 0.045
    stack.rotation.y += (targetRotation.y - stack.rotation.y) * 0.045
    folderGroups.forEach((folder) => {
      folder.position.y += (Number(folder.userData.targetY) - folder.position.y) * 0.08
      folder.position.z += (Number(folder.userData.targetZ) - folder.position.z) * 0.08
    })
    lastFrame = timestamp
  }
  renderer.render(scene, camera)
  if (!reducedMotion) animationFrame = requestAnimationFrame(renderFrame)
}

function resizeScene() {
  if (!renderer || !camera || !mountPoint.value) return
  const { width, height } = mountPoint.value.getBoundingClientRect()
  if (width <= 0 || height <= 0) return
  camera.aspect = width / height
  camera.position.z = width < 520 ? 8.9 : 8.1
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
  if (reducedMotion) renderFrame()
}

function handlePointerDown(event: PointerEvent) {
  pointerDown = true
  previousPointer = { x: event.clientX, y: event.clientY }
  mountPoint.value?.setPointerCapture(event.pointerId)
}

function handlePointerMove(event: PointerEvent) {
  if (pointerDown) {
    targetRotation.y += (event.clientX - previousPointer.x) * 0.003
    targetRotation.x += (event.clientY - previousPointer.y) * 0.002
    targetRotation.y = THREE.MathUtils.clamp(targetRotation.y, -0.48, 0.48)
    targetRotation.x = THREE.MathUtils.clamp(targetRotation.x, -0.28, 0.28)
    previousPointer = { x: event.clientX, y: event.clientY }
  } else {
    const bounds = mountPoint.value?.getBoundingClientRect()
    if (!bounds) return
    targetRotation = {
      x: -0.08 + ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.12,
      y: -0.13 + ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.18,
    }
  }
}

function handlePointerEnd() {
  pointerDown = false
  targetRotation = { x: -0.08, y: -0.13 }
}

function setUnavailable(error: unknown) {
  unavailable.value = true
  console.error('Unable to render the DXtechs 3D category catalog.', error)
}

function disposeScene() {
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
  resizeObserver?.disconnect()
  motionPreference?.removeEventListener('change', handleMotionChange)
  mountPoint.value?.removeEventListener('pointerdown', handlePointerDown)
  mountPoint.value?.removeEventListener('pointermove', handlePointerMove)
  mountPoint.value?.removeEventListener('pointerup', handlePointerEnd)
  mountPoint.value?.removeEventListener('pointercancel', handlePointerEnd)
  mountPoint.value?.removeEventListener('lostpointercapture', handlePointerEnd)
  geometries.forEach((geometry) => geometry.dispose())
  materials.forEach((material) => material.dispose())
  textures.forEach((texture) => texture.dispose())
  renderer?.dispose()
  renderer?.domElement.remove()
  renderer = undefined
  scene = undefined
  camera = undefined
  stack = undefined
  folderGroups = []
  geometries = []
  materials = []
  textures = []
}

function handleMotionChange(event: MediaQueryListEvent) {
  reducedMotion = event.matches
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
  animationFrame = undefined
  renderFrame()
}

function initializeScene() {
  const mount = mountPoint.value
  if (!mount) {
    setUnavailable(new Error('The 3D scene mount point was not created'))
    return
  }
  if (props.categories.length === 0) {
    setUnavailable(new Error('No categories are available for the 3D scene'))
    return
  }

  try {
    const bounds = mount.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) {
      setUnavailable(new Error('The 3D scene has no measurable layout size'))
      return
    }

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(bounds.width, bounds.height, false)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor('#f5f5f7', 0)
    mount.appendChild(renderer.domElement)

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(36, bounds.width / bounds.height, 0.1, 50)
    camera.position.set(0, 0, bounds.width < 520 ? 8.9 : 8.1)
    scene.add(new THREE.HemisphereLight('#ffffff', '#7a7a7a', 2.2))
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.1)
    keyLight.position.set(-3, 5, 7)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight('#f5f5f7', 0.8)
    fillLight.position.set(5, -2, 4)
    scene.add(fillLight)

    stack = new THREE.Group()
    scene.add(stack)
    folderGroups = []
    props.categories.forEach(addFolder)
    updateSelection()

    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionPreference.addEventListener('change', handleMotionChange)
    mount.addEventListener('pointerdown', handlePointerDown)
    mount.addEventListener('pointermove', handlePointerMove)
    mount.addEventListener('pointerup', handlePointerEnd)
    mount.addEventListener('pointercancel', handlePointerEnd)
    mount.addEventListener('lostpointercapture', handlePointerEnd)
    resizeObserver = new ResizeObserver(resizeScene)
    resizeObserver.observe(mount)
    renderFrame()
  } catch (error) {
    disposeScene()
    setUnavailable(error)
  }
}

watch(() => props.activeIndex, () => {
  updateSelection()
  if (reducedMotion) renderFrame()
})

onMounted(initializeScene)
onBeforeUnmount(disposeScene)
</script>

<template>
  <div class="three-storefront">
    <div ref="mountPoint" class="three-storefront-canvas" aria-hidden="true"></div>
    <div v-if="unavailable" class="three-storefront-fallback" role="status">
      <strong>Danh mục sản phẩm</strong>
      <span>Trình duyệt không hỗ trợ phần xem 3D. Các nút chọn danh mục vẫn dùng bình thường.</span>
    </div>
  </div>
</template>
