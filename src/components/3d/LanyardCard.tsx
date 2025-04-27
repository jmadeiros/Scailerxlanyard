import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Box } from '@react-three/drei'
import { BallCollider, CuboidCollider, RigidBody } from '@react-three/rapier'

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
  // Use a simplified card for testing visibility
  return (
    <group position={[position[0], position[1], position[2]]}>
      <RigidBody gravityScale={1} restitution={0.2}>
        <Box args={[2, 3, 0.1]} castShadow receiveShadow>
          <meshStandardMaterial color="white" />
        </Box>
      </RigidBody>
    </group>
  )
} 