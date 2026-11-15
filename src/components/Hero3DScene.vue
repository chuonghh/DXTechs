<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { gsap } from 'gsap'
import type { Group } from 'three'

const sceneContainer = ref<HTMLElement | null>(null)
const sceneGroup = shallowRef<Group | null>(null)
const prefersReducedMotion = ref(false)

let motionPreference: MediaQueryList | undefined
let gsapContext: gsap.Context | undefined
let rotateX: ((value: number) => void) | undefined
let rotateY: ((value: number) => void) | undefined

function updateParallax(event: PointerEvent) {
  const container = sceneContainer.value
  if (!container || prefersReducedMotion.value) return

  const bounds = container.getBoundingClientRect()
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5

  rotateX?.(vertical * 0.32)
  rotateY?.(horizontal * 0.48)
}

function resetParallax() {
  rotateX?.(0)
  rotateY?.(0)
}

function handleMotionPreferenceChange(event: MediaQueryListEvent) {
  prefersReducedMotion.value = event.matches
  if (event.matches) resetParallax()
}

watch(sceneGroup, (group) => {
  const container = sceneContainer.value
  if (!group || !container) return

  gsapContext?.revert()
  group.scale.setScalar(prefersReducedMotion.value ? 1 : 0.001)
  gsapContext = gsap.context(() => {
    rotateX = gsap.quickTo(group.rotation, 'x', {
      duration: 0.7,
      ease: 'power3.out',
    })
    rotateY = gsap.quickTo(group.rotation, 'y', {
      duration: 0.7,
      ease: 'power3.out',
    })

    if (!prefersReducedMotion.value) {
      gsap.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
    }
  }, container)
}, { flush: 'post' })

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionPreference.matches
  motionPreference.addEventListener('change', handleMotionPreferenceChange)

  sceneContainer.value?.addEventListener('pointermove', updateParallax)
  sceneContainer.value?.addEventListener('pointerleave', resetParallax)
})

onBeforeUnmount(() => {
  sceneContainer.value?.removeEventListener('pointermove', updateParallax)
  sceneContainer.value?.removeEventListener('pointerleave', resetParallax)
  motionPreference?.removeEventListener('change', handleMotionPreferenceChange)
  gsapContext?.revert()
  rotateX = undefined
  rotateY = undefined
})
</script>

<template>
  <section ref="sceneContainer" class="hero-3d-scene" aria-label="Mô hình 3D DXtechs">
    <TresCanvas
      class="hero-3d-scene__canvas"
      :alpha="true"
      :antialias="true"
      :clear-color="'#f5f5f7'"
      aria-hidden="true"
    >
      <TresPerspectiveCamera
        :position="[0, 0, 4.2]"
        :fov="38"
        :make-default="true"
      />
      <TresAmbientLight :intensity="1.7" />
      <TresDirectionalLight :position="[4, 5, 6]" :intensity="2.4" />
      <TresDirectionalLight :position="[-4, -2, 3]" :intensity="0.8" color="#2997ff" />

      <TresGroup ref="sceneGroup">
        <TresMesh>
          <TresBoxGeometry :args="[1.75, 1.75, 1.75]" />
          <TresMeshStandardMaterial
            color="#0066cc"
            :metalness="0.28"
            :roughness="0.3"
          />
        </TresMesh>
        <TresMesh :rotation="[Math.PI / 2.8, 0.25, 0]">
          <TresTorusGeometry :args="[1.42, 0.03, 12, 96]" />
          <TresMeshStandardMaterial
            color="#2997ff"
            :emissive="'#2997ff'"
            :metalness="0.45"
            :roughness="0.25"
          />
        </TresMesh>
      </TresGroup>

      <OrbitControls :enable-damping="true" :enable-zoom="false" />
    </TresCanvas>
    <p class="hero-3d-scene__hint">Rê chuột để xoay góc nhìn</p>
  </section>
</template>

<style scoped>
.hero-3d-scene {
  position: relative;
  width: 100%;
  min-height: 360px;
  overflow: hidden;
  background: #f5f5f7;
  touch-action: pan-y;
}

.hero-3d-scene__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-3d-scene__hint {
  position: absolute;
  right: 16px;
  bottom: 12px;
  margin: 0;
  color: #7a7a7a;
  font: 500 12px/1.4 'DM Sans', sans-serif;
  pointer-events: none;
}

@media (max-width: 600px) {
  .hero-3d-scene {
    min-height: 300px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-3d-scene__hint {
    display: none;
  }
}
</style>
