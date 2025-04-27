import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { useThree, useFrame, extend } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

interface LanyardCardProps {
  frontImage?: string;
  backImage?: string;
  lanyardTexture?: string;
  position?: [number, number, number];
  maxSpeed?: number;
  minSpeed?: number;
}

export default function LanyardCard({
  frontImage = '/assets/1729360719180.jpg',
  backImage = '/assets/Screenshot 2025-04-25 200507.png',
  lanyardTexture = '/assets/Screenshot 2025-04-20 214807.png',
  position = [0, 0, 0],
  maxSpeed = 50,
  minSpeed = 10,
}: LanyardCardProps) {
  const band = useRef<any>()
  const fixed = useRef<any>()
  const j1 = useRef<any>()
  const j2 = useRef<any>()
  const j3 = useRef<any>()
  const card = useRef<any>()
  const cardGroup = useRef<any>()
  const clipRef = useRef<any>()
  const clampRef = useRef<any>()
  const cardFrontRef = useRef<any>()
  const cardBackRef = useRef<any>()

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }

  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb') as any
  const texture = useTexture(lanyardTexture)
  const cardTexture = useTexture(frontImage)
  const cardBackTexture = useTexture(backImage)

  const [isFlipped, setIsFlipped] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [targetRotation, setTargetRotation] = useState(0)
  const [mouseDownTime, setMouseDownTime] = useState(0)
  const [shouldFlip, setShouldFlip] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [jumpForce, setJumpForce] = useState(0)
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  const jumpHeight = 0.15
  const jumpDecay = 0.92
  const flipSpeed = 5

  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))

  useEffect(() => {
    if (cardTexture) {
      cardTexture.rotation = Math.PI
      cardTexture.center.set(0.5, 0.5)
      if (frontImage.includes('WhatsApp')) {
        cardTexture.repeat.set(1.0, 1.0)
        cardTexture.offset.set(-0.3, -0.15)
      } else {
        cardTexture.repeat.set(0.95, 0.95)
        cardTexture.offset.set(-0.2, 0.05)
      }
    }
  }, [cardTexture, frontImage])

  useEffect(() => {
    if (cardBackTexture) {
      cardBackTexture.rotation = Math.PI
      cardBackTexture.center.set(0.5, 0.5)
      cardBackTexture.repeat.set(1.8, 1.3)
      cardBackTexture.offset.set(0.4, -0.35)
      cardBackTexture.repeat.x *= -1
    }
  }, [cardBackTexture])

  useEffect(() => {
    if (cardBackRef.current) {
      cardBackRef.current.rotation.set(0, Math.PI, 0)
    }
  }, [cardBackRef])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  const handleMouseDown = (e: any) => {
    e.stopPropagation()
    setMouseDownTime(Date.now())
    setShouldFlip(true)
    e.target.setPointerCapture(e.pointerId)
    drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
  }

  const handleMouseUp = (e: any) => {
    e.stopPropagation()
    e.target.releasePointerCapture(e.pointerId)
    const clickDuration = Date.now() - mouseDownTime
    if (clickDuration < 200 && shouldFlip && !isFlipping) {
      flipCard()
      triggerJump()
    }
    drag(false)
    setShouldFlip(false)
  }

  const handleMouseMove = () => {
    if (dragged) {
      setShouldFlip(false)
    }
  }

  const triggerJump = () => {
    setIsJumping(true)
    setJumpForce(jumpHeight)
  }

  const flipCard = () => {
    if (!isFlipping) {
      setIsFlipping(true)
      setIsFlipped(!isFlipped)
      setTargetRotation(isFlipped ? 0 : Math.PI)
    }
  }

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - (dragged as THREE.Vector3).x, y: vec.y - (dragged as THREE.Vector3).y, z: vec.z - (dragged as THREE.Vector3).z })
    }

    if (isFlipping && cardGroup.current) {
      const currentY = cardGroup.current.rotation.y
      const step = flipSpeed * delta
      if (Math.abs(currentY - targetRotation) > step) {
        cardGroup.current.rotation.y += (targetRotation > currentY) ? step : -step
        if (clipRef.current && clampRef.current) {
          clipRef.current.rotation.y = cardGroup.current.rotation.y
          clampRef.current.rotation.y = cardGroup.current.rotation.y
        }
      } else {
        cardGroup.current.rotation.y = targetRotation
        if (clipRef.current && clampRef.current) {
          clipRef.current.rotation.y = targetRotation
          clampRef.current.rotation.y = targetRotation
        }
        setIsFlipping(false)
      }
    }

    if (isJumping && card.current) {
      if (jumpForce > 0.1) {
        card.current.applyImpulse({ x: 0, y: jumpForce, z: 0 })
        setJumpForce(jumpForce * jumpDecay)
      } else {
        setIsJumping(false)
        setJumpForce(0)
      }
    }

    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[position[0], 3.5 + position[1], position[2]]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" position={[0, -0.5, 0]} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerMove={handleMouseMove}
            onPointerDown={handleMouseDown}
            onPointerUp={handleMouseUp}
          >
            <group ref={cardGroup}>
              <mesh ref={cardFrontRef} geometry={nodes.card.geometry} renderOrder={isFlipped ? 0 : 1}>
                <meshPhysicalMaterial map={cardTexture} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
              </mesh>
              <mesh ref={cardBackRef} geometry={nodes.card.geometry} rotation={[0, Math.PI, 0]} renderOrder={isFlipped ? 1 : 0}>
                <meshPhysicalMaterial map={cardBackTexture} map-anisotropy={32} clearcoat={0.5} clearcoatRoughness={0.1} roughness={0.2} metalness={0.6} />
              </mesh>
            </group>
            <mesh ref={clipRef} geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} renderOrder={2} position={[0, 0, 0.02]} />
            <mesh ref={clampRef} geometry={nodes.clamp.geometry} material={materials.metal} renderOrder={2} position={[0, 0, 0.02]} />
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