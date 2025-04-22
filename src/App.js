import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { useControls } from 'leva'

extend({ MeshLineGeometry, MeshLineMaterial })
useGLTF.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')
useTexture.preload('/assets/Screenshot 2025-04-20 214807.png')
useTexture.preload('/assets/1729360719180.jpg')

export default function App() {
  const { debug } = useControls({ debug: false })
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
      <ambientLight intensity={Math.PI} />
      <Physics debug={debug} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band />
      </Physics>
      <Environment background blur={0.75}>
        <color attach="background" args={['black']} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef() // prettier-ignore
  const cardGroup = useRef() // Reference for the card group for flipping
  const clipRef = useRef() // Reference for the clip
  const clampRef = useRef() // Reference for the clamp
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb')
  const texture = useTexture('/assets/Screenshot 2025-04-20 214807.png')
  const cardTexture = useTexture('/assets/1729360719180.jpg')
  
  // State for tracking if the card is flipped
  const [isFlipped, setIsFlipped] = useState(false)
  // State for tracking when the card is being flipped (for animation)
  const [isFlipping, setIsFlipping] = useState(false)
  // Target rotation for the flip animation
  const [targetRotation, setTargetRotation] = useState(0)
  // Animation speed for flipping
  const flipSpeed = 5 
  // Track mouse down and up times to distinguish click from drag
  const [mouseDownTime, setMouseDownTime] = useState(0)
  // Flag to track if card should flip on release
  const [shouldFlip, setShouldFlip] = useState(false)
  // State for tracking jump animation
  const [isJumping, setIsJumping] = useState(false)
  const [jumpForce, setJumpForce] = useState(0)
  const jumpHeight = 0.15 // Maximum jump height - reduced to 0.15 for a very subtle effect
  const jumpDecay = 0.92 // How quickly the jump fades
  
  // Apply transformations to fix orientation, size and position
  useEffect(() => {
    if (cardTexture) {
      // Rotate 180 degrees to fix upside down issue
      cardTexture.rotation = Math.PI
      // Adjust the offset/repeat to fix centering and size issues
      cardTexture.center.set(0.5, 0.5) // Center the texture
      cardTexture.repeat.set(0.95, 0.95) // Zoom out more
      cardTexture.offset.set(-0.2, 0.05) // Shift further left
    }
  }, [cardTexture])
  
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  // Function to handle mouse down
  const handleMouseDown = (e) => {
    e.stopPropagation()
    setMouseDownTime(Date.now())
    setShouldFlip(true)
    e.target.setPointerCapture(e.pointerId)
    drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
  }

  // Function to handle mouse up
  const handleMouseUp = (e) => {
    e.stopPropagation()
    e.target.releasePointerCapture(e.pointerId)
    // If mouse was down for less than 200ms and card didn't move much, consider it a click
    const clickDuration = Date.now() - mouseDownTime
    if (clickDuration < 200 && shouldFlip && !isFlipping) {
      flipCard()
      // Trigger jump effect on click
      triggerJump()
    }
    drag(false)
    setShouldFlip(false)
  }

  // Function to handle mouse move
  const handleMouseMove = () => {
    if (dragged) {
      // If drag detected, don't flip on release
      setShouldFlip(false)
    }
  }

  // Trigger the jump animation
  const triggerJump = () => {
    setIsJumping(true)
    setJumpForce(jumpHeight)
  }

  // Handle the card flip
  const flipCard = () => {
    if (!isFlipping) {
      setIsFlipping(true)
      setIsFlipped(!isFlipped)
      setTargetRotation(isFlipped ? 0 : Math.PI) // Set target rotation based on flip state
    }
  }

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    
    // Handle the card flip animation
    if (isFlipping && cardGroup.current) {
      const currentY = cardGroup.current.rotation.y
      const step = flipSpeed * delta
      
      // Smoothly animate to the target rotation
      if (Math.abs(currentY - targetRotation) > step) {
        cardGroup.current.rotation.y += (targetRotation > currentY) ? step : -step
        
        // Rotate the clip and clamp with the card
        if (clipRef.current && clampRef.current) {
          // Clip and clamp follow the card's rotation
          clipRef.current.rotation.y = cardGroup.current.rotation.y
          clampRef.current.rotation.y = cardGroup.current.rotation.y
        }
      } else {
        // Animation completed
        cardGroup.current.rotation.y = targetRotation
        
        // Ensure clip and clamp are at final rotation
        if (clipRef.current && clampRef.current) {
          clipRef.current.rotation.y = targetRotation
          clampRef.current.rotation.y = targetRotation
        }
        
        setIsFlipping(false)
      }
    }
    
    // Handle jump animation
    if (isJumping && card.current) {
      if (jumpForce > 0.1) {
        // Apply upward impulse for jump
        card.current.applyImpulse({ x: 0, y: jumpForce, z: 0 })
        
        // Decay the jump force
        setJumpForce(jumpForce * jumpDecay)
      } else {
        setIsJumping(false)
        setJumpForce(0)
      }
    }
    
    if (fixed.current) {
      // Fix most of the jitter when over pulling the card
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      // Calculate catmul curve
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))
      // Tilt it back towards the screen
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 3.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" position={[0, -0.5, 0]} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerMove={handleMouseMove}
            onPointerDown={handleMouseDown}
            onPointerUp={handleMouseUp}>
            {/* Group for card flipping */}
            <group ref={cardGroup}>
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial map={cardTexture} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
              </mesh>
            </group>
            {/* Clip and clamp with refs for rotation */}
            <mesh ref={clipRef} geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} renderOrder={1} position={[0, 0, 0.02]} />
            <mesh ref={clampRef} geometry={nodes.clamp.geometry} material={materials.metal} renderOrder={1} position={[0, 0, 0.02]} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} renderOrder={0}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} depthWrite={false} resolution={[width, height]} useMap map={texture} repeat={[-3, 1]} lineWidth={1} transparent opacity={0.9} />
      </mesh>
    </>
  )
} 