import React, { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import MatchIcon from '@/assets/svg/match.svg?react'
import styles from './index.module.scss'
import { extractJsonFromMarkdown } from '../Chat/utils/json'
import TruncateText from '@/components/TruncateText'
import LoadingIcon from '@/assets/svg/loading.svg?react'
import { useTranslation } from 'react-i18next'

interface TaskAnalysisProps {
  fatherNodes: any[]
  selectedNode: {
    nodeIndex: number
    childIndex?: number
  } | null
  onNodeClick: (nodeIndex: number, childIndex?: number) => void
  selectedTaskIndex?: number
}

const TaskAnalysis: React.FC<TaskAnalysisProps> = ({
  fatherNodes,
  selectedNode,
  onNodeClick,
  selectedTaskIndex,
}) => {
  const [expandedSection, setExpandedSection] = useState<'tasks' | 'criteria' | null>(null)
  const { t } = useTranslation()
  const isUserSelection = useRef(false)
  const lastNodeCount = useRef(0)

  const handleSectionToggle = (section: 'tasks' | 'criteria') => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // 自动选择逻辑
  useEffect(() => {
    if (!fatherNodes || fatherNodes.length === 0) {
      lastNodeCount.current = 0
      return
    }

    const currentNodeCount = fatherNodes.length

    // 如果不是人为选择，始终选择最后一个
    if (!isUserSelection.current) {
      // 找到最后一个有数据的节点
      for (let i = fatherNodes.length - 1; i >= 0; i--) {
        const node = fatherNodes[i]

        if (node.end?.name === 'search_verify_agent') {
          const content = node.end.data.content
          const json = typeof content === 'string' ? extractJsonFromMarkdown(content) : content

          // 检查是否有tasks子项
          if (json?.tasks && json.tasks.length > 0) {
            // 有子tab，选择最后一个子tab
            const lastTaskIndex = json.tasks.length - 1
            // 检查当前是否已经选中了最后一个子tab
            if (selectedNode?.nodeIndex !== 1 || selectedNode?.childIndex !== lastTaskIndex) {
              onNodeClick(1, lastTaskIndex)
              setExpandedSection('tasks')
            }
            break
          } else {
            // 没有子tab，选择主tab
            if (selectedNode?.nodeIndex !== 1 || selectedNode?.childIndex !== undefined) {
              onNodeClick(1)
            }
            break
          }
        } else if (node.start?.name === 'executor_agent') {
          // executor_agent没有子tab，直接选择主tab
          if (selectedNode?.nodeIndex !== 1 || selectedNode?.childIndex !== undefined) {
            onNodeClick(1)
          }
          break
        }
      }
    }

    // 更新节点数量
    lastNodeCount.current = currentNodeCount
  }, [fatherNodes, onNodeClick, selectedNode])

  // 专门监听数据内容变化，确保在数据更新时触发自动选择
  useEffect(() => {
    if (!fatherNodes || fatherNodes.length === 0 || isUserSelection.current) {
      return
    }

    // 检查最后一个节点的数据是否有变化
    const lastNode = fatherNodes[fatherNodes.length - 1]
    if (lastNode?.end?.name === 'search_verify_agent') {
      const content = lastNode.end.data.content
      const json = typeof content === 'string' ? extractJsonFromMarkdown(content) : content

      if (json?.tasks && json.tasks.length > 0) {
        const lastTaskIndex = json.tasks.length - 1
        // 如果当前选中的不是最后一个子tab，则自动选择
        if (selectedNode?.nodeIndex !== 1 || selectedNode?.childIndex !== lastTaskIndex) {
          onNodeClick(1, lastTaskIndex)
          setExpandedSection('tasks')
        }
      } else {
        // 如果没有子tab，选择主tab
        if (selectedNode?.nodeIndex !== 1 || selectedNode?.childIndex !== undefined) {
          onNodeClick(1)
        }
      }
    } else if (lastNode?.end?.name === 'executor_agent') {
      // executor_agent没有子tab，直接选择主tab
      if (selectedNode?.nodeIndex !== 1 || selectedNode?.childIndex !== undefined) {
        onNodeClick(1)
      }
    }
  }, [fatherNodes, selectedNode, onNodeClick])

  useEffect(() => {
    if (selectedNode) {
      isUserSelection.current = false
    }
  }, [selectedNode])

  const renderSearchVerifyAgent = (node: any, index: number) => {
    const content = node.end.data.content
    const json = typeof content === 'string' ? extractJsonFromMarkdown(content) : content

    return (
      <div key={index} className={styles['task-analysis-container']}>
        <div
          className={classNames(styles['start-node'], {
            [styles['selected-expanded']]:
              selectedNode?.nodeIndex === 1 &&
              expandedSection === 'tasks' &&
              selectedTaskIndex !== undefined,
          })}
        >
          <div
            className={classNames(styles['start-node-title'], styles['clickable'])}
            onClick={() => {
              // 标记为人为选择
              isUserSelection.current = true
              handleSectionToggle('tasks')
            }}
          >
            <div className={styles['start-node-title-text']}>
              <span className={styles['task-number']}>#1</span>
              <MatchIcon className={styles['match-icon-big']} />
              <span className={styles['task-title']}>{t('workflow.decomposeProblem')}</span>
            </div>
            <div
              className={styles['expand-icon']}
              onClick={(e) => {
                e.stopPropagation()
                // 标记为人为选择
                isUserSelection.current = true
                handleSectionToggle('tasks')
              }}
            >
              {expandedSection === 'tasks' ? <UpOutlined /> : <DownOutlined />}
            </div>
          </div>

          {expandedSection === 'tasks' && (
            <div className={styles['children-container']}>
              {json?.tasks?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={classNames(styles['child-node'], styles['clickable'], {
                    [styles['selected']]: selectedTaskIndex === idx,
                  })}
                  onClick={() => {
                    // 标记为人为选择
                    isUserSelection.current = true
                    onNodeClick(1, idx)
                  }}
                >
                  <div className={styles['child-node-title']}>
                    <div className={styles['child-left']}>
                      <span className={styles['child-prefix']}>#</span>
                      <TruncateText title={item?.task || ''} className={styles['child-title']}>
                        {item?.task || ''}
                      </TruncateText>
                    </div>
                    <MatchIcon className={styles['match-icon-big']} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 验证条件部分 */}
        <div
          className={classNames(styles['start-node'], {
            [styles['selected-expanded']]:
              selectedNode?.nodeIndex === 1 &&
              expandedSection === 'criteria' &&
              selectedTaskIndex !== undefined,
          })}
        >
          <div
            className={classNames(styles['start-node-title'], styles['clickable'])}
            onClick={() => {
              isUserSelection.current = true
              handleSectionToggle('criteria')
            }}
          >
            <div className={styles['start-node-title-text']}>
              <span className={styles['task-number']}>#2</span>
              <MatchIcon className={styles['match-icon-big']} />
              <span className={styles['task-title']}>{t('workflow.validateConditions')}</span>
            </div>
            <div
              className={styles['expand-icon']}
              onClick={(e) => {
                e.stopPropagation()
                isUserSelection.current = true
                handleSectionToggle('criteria')
              }}
            >
              {expandedSection === 'criteria' ? <UpOutlined /> : <DownOutlined />}
            </div>
          </div>

          {expandedSection === 'criteria' && (
            <div className={styles['children-container']}>
              {json?.metadata?.criteria?.map((item: any, midx: number) => (
                <div key={midx} className={styles['child-node']}>
                  <div className={styles['child-node-title']}>
                    <div className={styles['child-left']}>
                      <span className={styles['child-prefix']}>#</span>
                      <TruncateText title={item} className={styles['child-title']}>
                        {item}
                      </TruncateText>
                    </div>
                    <MatchIcon className={styles['match-icon-big']} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderExecutorAgent = (node: any, index: number) => {
    if (node.start?.name !== 'executor_agent') {
      return null
    }

    return (
      <div
        key={index}
        className={classNames(styles['start-node'], styles['clickable'], {
          [styles['selected']]:
            selectedNode?.nodeIndex === 1 && selectedNode?.childIndex === undefined,
        })}
        onClick={() => {
          isUserSelection.current = true
          onNodeClick(1)
        }}
      >
        <div className={styles['start-node-title']}>
          <div className={styles['start-node-title-text']}>
            <span className={styles['task-number']}>#{index + 2}</span>
            {node.end ? (
              <MatchIcon className={styles['match-icon-big']} />
            ) : (
              <LoadingIcon className="loading-spinner" />
            )}
            <span className={styles['task-title']}>{t('workflow.searchValidate')}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['chat-start-list']}>
      {fatherNodes?.map((node, index) => {
        if (node.end?.name === 'search_verify_agent') {
          return renderSearchVerifyAgent(node, index)
        }
        return renderExecutorAgent(node, index)
      })}
    </div>
  )
}

export default TaskAnalysis
