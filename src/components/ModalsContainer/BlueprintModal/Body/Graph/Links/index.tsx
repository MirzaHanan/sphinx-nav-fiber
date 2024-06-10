/* eslint-disable react/no-array-index-key */
import { QuadraticBezierLine, Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Group, Vector3 } from 'three'
import { SchemaLink } from '~/network/fetchSourcesData'
import { SchemaExtended } from '../../../types'
import { NODE_RADIUS } from '../constants'
import { getLoopControlPoints, truncateText } from '~/components/ModalsContainer/BlueprintModal/Body/Editor/utils'

type Props = {
  links: SchemaLink[]
  nodes?: SchemaExtended[]
}

const CONE_RADIUS = 2
const CONE_HEIGHT = 2
const MAX_TEXT_LENGTH = 10

const getPointOnLineAtDistance = (start: Vector3, end: Vector3, r: number): Vector3 => {
  const direction = new Vector3().subVectors(end, start)
  const unitDirection = direction.normalize()
  const displacement = unitDirection.multiplyScalar(r)

  return new Vector3().addVectors(start, displacement)
}

export const Lines = ({ links, nodes }: Props) => {
  const group = useRef<Group>(null)
  const { camera } = useThree()

  const startVector = new Vector3()
  const endVector = new Vector3()
  const middlePoint = new Vector3()
  const textOffset = new Vector3()
  const firstLineEnd = new Vector3()
  const secondLineStart = new Vector3()
  const endPosition = new Vector3()
  const startPosition = new Vector3()

  useFrame(() => {
    if (group.current && nodes) {
      group.current.children.forEach((child, index) => {
        const link = links[index]

        if (!link) {
          return
        }

        const nodeEnd = nodes.find((i) => i.ref_id === link.source)
        const nodeStart = nodes.find((i) => i.ref_id === link.target)

        startVector.set(nodeStart?.x || 0, nodeStart?.y || 0, nodeStart?.z || 0)
        endVector.set(nodeEnd?.x || 0, nodeEnd?.y || 0, nodeEnd?.z || 0)

        const lineStart = child.children[0] as {
          setPoints?: (start: Vector3, end: Vector3, middlePoint: Vector3) => void
        }

        const lineEnd = child.children[1] as {
          setPoints?: (start: Vector3, end: Vector3, middlePoint: Vector3) => void
        }

        const arrow = child.children[2]
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const text = child.children[3] as any

        if (nodeStart?.ref_id === nodeEnd?.ref_id) {
          const [controlPoint1, endPoint, controlPoint2] = getLoopControlPoints(startVector)

          lineStart.setPoints?.(startVector, controlPoint2, controlPoint1)
          lineEnd.setPoints?.(controlPoint2, endVector, controlPoint1)

          arrow.position.set(controlPoint2.x, controlPoint2.y, endPoint.z)
          arrow.lookAt(controlPoint1)
          arrow.rotateX(-Math.PI / 2)

          text.position.set(controlPoint2.x, controlPoint2.y, endPoint.z)
          text.lookAt(camera.position)
        } else {
          endPosition.copy(getPointOnLineAtDistance(endVector, startVector, NODE_RADIUS + CONE_HEIGHT))
          startPosition.copy(startVector)
          middlePoint.lerpVectors(startPosition, endPosition, 0.5)

          const textWidth = 30

          textOffset
            .subVectors(endPosition, startPosition)
            .normalize()
            .multiplyScalar(textWidth / 2)

          firstLineEnd.subVectors(middlePoint, textOffset)
          secondLineStart.addVectors(middlePoint, textOffset)

          lineStart.setPoints?.(startPosition, firstLineEnd, middlePoint)
          lineEnd.setPoints?.(secondLineStart, endPosition, middlePoint)

          arrow.position.set(endPosition.x, endPosition.y, endPosition.z)
          arrow.lookAt(startPosition)
          arrow.rotateX(-Math.PI / 2)

          text.position.set(middlePoint.x, middlePoint.y, middlePoint.z)
          text.lookAt(camera.position)

          const angle = Math.atan2(endPosition.y - startPosition.y, endPosition.x - startPosition.x)

          if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            text.rotation.set(Math.PI, 0, -angle)
          } else {
            text.rotation.set(0, 0, angle)
          }

          const distance = startPosition.distanceTo(endPosition)

          if (distance < textWidth) {
            text.text = truncateText(link.edge_type, MAX_TEXT_LENGTH)
          } else {
            text.text = link.edge_type
          }
        }
      })
    }
  })

  return (
    <group ref={group}>
      {links.map((link) => (
        <group key={link.ref_id}>
          <QuadraticBezierLine color="white" end={[0, 0, 0]} lineWidth={2} start={[0, 0, 0]} />
          <QuadraticBezierLine color="white" end={[0, 0, 0]} lineWidth={2} start={[0, 0, 0]} />
          <mesh position={new Vector3(0, 0, 0)}>
            <coneGeometry args={[CONE_RADIUS, CONE_HEIGHT, 32]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <Text
            anchorX="center"
            anchorY="middle"
            color="white"
            fontSize={4}
            lineHeight={1}
            maxWidth={20}
            rotation={[0, 0, 0]}
            textAlign="center"
          >
            {truncateText(link.edge_type, MAX_TEXT_LENGTH)}
          </Text>
        </group>
      ))}
    </group>
  )
}

Lines.displayName = 'Lines'
