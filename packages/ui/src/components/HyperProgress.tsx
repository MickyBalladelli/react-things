import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { Mesh, ShaderMaterial } from 'three'

// ---------------------------------------------------------------------------
// Vertex shader – multi‑frequency sine‑wave displacement that flows over time
// to create the 4D hyper‑surface illusion.
// ---------------------------------------------------------------------------
const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  void main() {
    // Start with the original normal & position
    vec3 pos = position;
    vec3 norm = normalize(normal);

    // Multiple displacement layers – different frequencies, phases & axes
    float d1 = sin(pos.x * 2.4 + uTime * 0.7) * cos(pos.z * 3.1 + uTime * 0.5) * 0.18;
    float d2 = cos(pos.y * 3.8 - uTime * 0.8) * sin(pos.x * 2.9 + uTime * 0.6) * 0.12;
    float d3 = sin(pos.z * 4.2 + uTime * 1.1) * cos(pos.y * 2.6 - uTime * 0.4) * 0.14;
    float d4 = sin((pos.x + pos.y + pos.z) * 1.7 + uTime * 0.55) * 0.09;

    // Compound displacement along the normal
    pos += norm * (d1 + d2 + d3 + d4);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vPosition = pos;
    vNormal = normalize(normalMatrix * norm);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  }
`

// ---------------------------------------------------------------------------
// Fragment shader – iridescent / holographic with Fresnel rim glow,
// chromatic dispersion and dynamic spectral colour shifting.
// Palette: deep cyan → violet → neon rose → gold accents.
// ---------------------------------------------------------------------------
const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel term – 0 at face‑on, 1 at grazing
    float fresnel = 1.0 - abs(dot(normal, viewDir));
    fresnel = pow(fresnel, 2.8);

    // Dynamic hue that drifts over time and position
    float hue = fract(
      vWorldPosition.x * 0.35 +
      vWorldPosition.y * 0.28 +
      vWorldPosition.z * 0.22 +
      uTime * 0.09
    );

    // Chromatic‐dispersion offset (slight normal shift per channel)
    float disp = fresnel * 0.06;
    float hueR = fract(hue + disp * 1.3);
    float hueG = fract(hue);
    float hueB = fract(hue - disp * 1.3);

    // Convert hue→RGB (saturated, bright)
    vec3 colR = 0.5 + 0.5 * cos(6.28318 * (hueR + vec3(0.0, 0.33, 0.67)));
    vec3 colG = 0.5 + 0.5 * cos(6.28318 * (hueG + vec3(0.0, 0.33, 0.67)));
    vec3 colB = 0.5 + 0.5 * cos(6.28318 * (hueB + vec3(0.0, 0.33, 0.67)));

    // Mix channels with dispersion weight – strongest at rim
    float dispMix = fresnel * 0.65;
    vec3 baseColor = mix(colG, vec3(colR.r, colG.g, colB.b), dispMix);

    // Boost saturation & brightness for the holographic look
    baseColor = mix(baseColor, vec3(1.0), fresnel * 0.28);

    // Rim glow – strong at grazing angles, fades to centre
    vec3 rimColor = mix(
      vec3(0.38, 0.82, 0.98),   // cyan
      vec3(0.91, 0.18, 0.58),   // neon rose
      sin(uTime * 0.45) * 0.5 + 0.5
    );
    rimColor = mix(rimColor, vec3(1.0, 0.84, 0.28), fresnel * 0.4); // gold accent at rim

    float rimStrength = fresnel * (1.2 + 0.3 * sin(vWorldPosition.y * 3.0 + uTime * 0.8));
    vec3 color = mix(baseColor, rimColor, rimStrength);

    // Ambient fill so the dark side isn't pure black
    float ambient = 0.08;
    vec3 lightDir = normalize(vec3(1.0, 0.9, 0.7));
    float diffuse = max(dot(normal, lightDir), 0.0) * 0.35;

    color = color * (ambient + diffuse + rimStrength * 0.7);

    // Subtle gold sparkle at very high Fresnel
    float sparkle = pow(fresnel, 8.0) * 0.6;
    color += vec3(1.0, 0.82, 0.22) * sparkle;

    gl_FragColor = vec4(color, 1.0);
  }
`

// ---------------------------------------------------------------------------
// Shader material factory – memoised so it only compiles once.
// ---------------------------------------------------------------------------
function useHyperMaterial() {
  return useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 }
      },
      side: THREE.DoubleSide,
      transparent: false,
      depthWrite: true,
      depthTest: true
    })
    return material
  }, [])
}

// ---------------------------------------------------------------------------
// The animated Torus Knot mesh
// ---------------------------------------------------------------------------
function HyperKnot() {
  const meshRef = useRef<Mesh>(null)
  const material = useHyperMaterial()

  const geometry = useMemo(() => {
    // TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q)
    return new THREE.TorusKnotGeometry(1.0, 0.32, 200, 32, 3, 4)
  }, [])

  useFrame((_, delta) => {
    if (material) {
      material.uniforms.uTime.value += delta * 0.8
    }

    if (meshRef.current) {
      // Gentle auto‑rotation so the viewer always sees evolving faces
      meshRef.current.rotation.y += delta * 0.12
      meshRef.current.rotation.x += delta * 0.06
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  )
}

// ---------------------------------------------------------------------------
// Orbiting point light for dramatic rim highlights
// ---------------------------------------------------------------------------
function OrbitingLight() {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((_, delta) => {
    if (!lightRef.current) return
    const t = performance.now() * 0.0004
    const radius = 3.8
    lightRef.current.position.x = Math.cos(t) * radius
    lightRef.current.position.z = Math.sin(t) * radius
    lightRef.current.position.y = Math.sin(t * 1.7) * 1.6
  })

  return (
    <pointLight
      ref={lightRef}
      color="#88ccff"
      intensity={18}
      distance={12}
      decay={1.5}
    />
  )
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface HyperProgressProps {
  /** Canvas width – defaults to 100% via CSS (set via style/className) */
  width?: number | string
  /** Canvas height – defaults to 360 */
  height?: number | string
  /** Show orbit controls so users can interact */
  interactive?: boolean
  /** Bloom intensity – 0 disables. Default 0.9 */
  bloomIntensity?: number
  /** Bloom luminance threshold. Default 0.3 */
  bloomThreshold?: number
  /** Bloom radius. Default 0.7 */
  bloomRadius?: number
  /** CSS class name applied to the wrapper div */
  className?: string
  /** Inline styles applied to the wrapper div */
  style?: React.CSSProperties
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export function HyperProgress({
  width = '100%',
  height = 360,
  interactive = false,
  bloomIntensity = 0.9,
  bloomThreshold = 0.3,
  bloomRadius = 0.7,
  className,
  style
}: HyperProgressProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: 'radial-gradient(ellipse at center, #0a0a14 0%, #010104 70%)',
        overflow: 'hidden',
        borderRadius: 12,
        ...style
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 42, near: 0.1, far: 30 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#020210']} />

        {/* Key light for diffuse shading */}
        <ambientLight intensity={0.15} color="#334466" />

        {/* Orbiting rim highlight */}
        <OrbitingLight />

        {/* Secondary fill */}
        <pointLight
          position={[-2.5, 0.8, -2.2]}
          intensity={7}
          color="#cc4488"
          distance={10}
          decay={1.5}
        />

        {/* The hero geometry */}
        <HyperKnot />

        {/* Post‑processing bloom for luminescent edges */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={bloomThreshold}
            intensity={bloomIntensity}
            radius={bloomRadius}
            mipmapBlur
          />
        </EffectComposer>

        {interactive && <OrbitControls enableDamping dampingFactor={0.08} />}
      </Canvas>
    </div>
  )
}

export default HyperProgress