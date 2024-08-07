import { TextField } from '@mui/material'
import { FC } from 'react'
import styled from 'styled-components'
import ArrowRight from '~/components/Icons/ArrowRight'
import FlipIcon from '~/components/Icons/FlipIcon'
import NodeCircleIcon from '~/components/Icons/NodeCircleIcon'
import { Flex } from '~/components/common/Flex'
import { Text } from '~/components/common/Text'
import { NodeExtended, TEdge } from '~/types'
import { ToNode } from './ToNode'

type Props = {
  from: NodeExtended | undefined
  onSelect: (edge: TEdge | null) => void
  isSwapped: boolean
  setIsSwapped: () => void
  selectedToNode: TEdge | null
}

interface SectionProps {
  swap: boolean
}

export const TitleEditor: FC<Props> = ({ from, onSelect, selectedToNode, isSwapped, setIsSwapped }) => (
  <Flex mb={20}>
    <Flex align="center" direction="row" justify="space-between" mb={18}>
      <Flex align="center" direction="row">
        <StyledText>Merge topic</StyledText>
      </Flex>
    </Flex>
    <Div swap={isSwapped}>
      <SectionWrapper>
        <FromSection disabled label={!isSwapped ? 'From' : 'To'} swap={isSwapped} value={from?.name} />
      </SectionWrapper>

      <Flex my={16}>
        <StyledLabel>Type</StyledLabel>
        <Text>IS ALIAS</Text>
      </Flex>

      <Flex data-testid="to-section-container">
        <ToSection>
          <ToLabel>{!isSwapped ? 'To' : 'From'}</ToLabel>
          <ToNode
            dataId="to-node"
            onSelect={onSelect}
            selectedValue={selectedToNode}
            topicId={from?.ref_id as string}
          />
        </ToSection>
      </Flex>

      <NodeConnectorDiv>
        <IconTopContainer>
          <NodeCircleIcon />
        </IconTopContainer>
        <IconMidContainer data-testid="swap-icon" onClick={setIsSwapped}>
          <FlipIcon />
        </IconMidContainer>
        <IconBottomContainer>
          <ArrowRight />
        </IconBottomContainer>
      </NodeConnectorDiv>
    </Div>
  </Flex>
)

const StyledText = styled(Text)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`

const SectionWrapper = styled(Flex)`
  flex: 1 1 100%;
`

const NodeConnectorDiv = styled.div`
  position: absolute;
  top: 26px;
  bottom: 26px;
  left: 4px;
  width: 35px;
  border-left: 1.5px solid #6b7a8d4d;
  border-top: 1.5px solid #6b7a8d4d;
  border-bottom: 1.5px solid #6b7a8d4d;
  border-radius: 12px 0 0 12px;
`

const Div = styled.div<SectionProps>`
  position: relative;
  color: white;
  font-family: 'Barlow';
  display: flex;
  flex-direction: ${(props) => (props.swap ? 'column-reverse' : 'column')};
  margin-bottom: 10px;
  padding-left: 38px;
`

const FromSection = styled(TextField)<SectionProps>`
  position: relative;
  width: 100%;
  padding: 16px;
  gap: 10px;
  border-radius: 6px;
  border: 1px solid #6b7a8d4d;
  opacity: 0px;
  display: flex;
`

const ToSection = styled.div`
  position: relative;
  width: 100%;
  padding: 15px;
  gap: 10px;
  border-radius: 6px;
  border: 1.4px solid #6b7a8d4d;
  opacity: 0px;
  display: flex;
  align-items: center;
`

const StyledLabel = styled.label`
  color: #bac1c6;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: left;
  margin-bottom: 6px;
`

const ToLabel = styled.label`
  color: #bac1c6;
  background-color: #23252f;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: left;
  position: absolute;
  left: 15px;
  top: -10px;
`

const IconTopContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-50%) translateX(50%);
  color: #23252f;
`

const IconMidContainer = styled.div`
  position: absolute;
  color: transparent;
  top: 50%;
  left: 0;
  transform: translateY(-50%) translateX(-50%);
  cursor: pointer;
  width: 32px;
  height: 32px;
  background-color: #303342;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`

const IconBottomContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(10px) translateX(3px);
  color: #6b7a8d;
  line-height: 1;
`
