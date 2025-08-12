import { useAppSelector } from '@/store/hooks'
import styles from './index.module.scss'
import classNames from 'classnames'
import { chatNewSelectors } from '@/store/selectors'
import { useEffect, useState, useRef, JSX } from 'react'
import { TreeNode } from '@/store/slices/chatNew'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '@/store'
import { getSessionId } from '@/store/selectors/chat'
// import { openUrl } from '@tauri-apps/plugin-opener';
import { useLocation, useNavigate } from 'react-router-dom'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Statistic } from 'antd'
import MatchIcon from '@/assets/svg/match.svg?react'
import { getFlatChildren } from '@/utils/chat'
// import OptimizedContentRenderer from '../OptimizedRenderer';
import Agent from '../Agent'
import MatchIconRenderer from '../MatchIcon'

import TaskAnalysis from '@/components/TaskAnalysis'
import LoadingIcon from '@/assets/svg/loading.svg?react'
import { findRoundHasEndByRunId, findRoundHasErrorAndEndByRunId } from '../utils/chat'
import { AppRoute } from '@/router'

const ChatStep = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const fatherNodes = useAppSelector(chatNewSelectors.getCurrentRoundChildren)
  const currentSessionId = useSelector((state: RootState) => getSessionId(state))
  const currentRound = useAppSelector(chatNewSelectors.getCurrentRound)

  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
  const [selectedNode, setSelectedNode] = useState<{
    nodeIndex: number
    childIndex?: number
  } | null>(null)
  const [searchSelectedNode, setSearchSelectedNode] = useState<{
    nodeIndex: number
    childIndex?: number
  } | null>(null)
  // 用于跟踪是否是人为选择
  const isUserSelection = useRef(false)
  // 用于跟踪上一次的节点数量
  const lastNodeCount = useRef(0)
  // 用于跟踪上一次的sessionId
  const lastSessionId = useRef<string | null>(null)
  // 用于跟踪上一次的轮次ID
  const lastRoundId = useRef<string | null>(null)

  // 检测sessionId变化，重置人为选择状态
  useEffect(() => {
    if (currentSessionId !== lastSessionId.current) {
      // 新对话开始，重置人为选择状态
      isUserSelection.current = false
      lastNodeCount.current = 0
      setSelectedNode(null)
      setSearchSelectedNode(null)
      setExpandedNodes(new Set())
      lastSessionId.current = currentSessionId
      lastRoundId.current = null
    }
  }, [currentSessionId])

  // 检测轮次变化，重置人为选择状态
  useEffect(() => {
    if (currentRound?.id && currentRound.id !== lastRoundId.current) {
      // 新轮次开始，重置人为选择状态
      isUserSelection.current = false
      lastNodeCount.current = 0
      setSelectedNode(null)
      setSearchSelectedNode(null)
      setExpandedNodes(new Set())
      lastRoundId.current = currentRound.id
    }
  }, [currentRound?.id])

  // 自动选择最新tab的逻辑
  useEffect(() => {
    if (!fatherNodes || fatherNodes.length === 0) {
      setSelectedNode(null)
      lastNodeCount.current = 0
      return
    }

    // 如果不是人为选择，总是选择最新的tab
    if (!isUserSelection.current) {
      // 找到最新的节点（包括正在执行的节点）
      let latestNodeIndex = -1
      let latestChildIndex = -1

      // 从后往前遍历，找到最新的节点
      for (let i = fatherNodes.length - 1; i >= 0; i--) {
        const node = fatherNodes[i]

        // 检查节点是否存在（有start数据）
        if (node.start) {
          if (node.children.length === 0) {
            // 父节点存在且没有子节点
            latestNodeIndex = i
            break
          } else {
            // 父节点存在且有子节点，检查子节点
            for (let j = node.children.length - 1; j >= 0; j--) {
              if (node.children[j].start) {
                latestNodeIndex = i
                latestChildIndex = j
                break
              }
            }
            if (latestChildIndex !== -1) {
              break
            }
          }
        }
      }

      // 如果找到了节点
      if (latestNodeIndex !== -1) {
        const shouldUpdate =
          selectedNode?.nodeIndex !== latestNodeIndex ||
          selectedNode?.childIndex !== (latestChildIndex !== -1 ? latestChildIndex : undefined)

        if (shouldUpdate) {
          if (latestChildIndex !== -1) {
            // 选择子节点，展开父节点
            setExpandedNodes(new Set([latestNodeIndex]))
            setSelectedNode({ nodeIndex: latestNodeIndex, childIndex: latestChildIndex })
          } else {
            // 选择父节点
            setSelectedNode({ nodeIndex: latestNodeIndex })
          }
        }
      }
    }

    // 更新节点数量
    lastNodeCount.current = fatherNodes.length
  }, [fatherNodes, selectedNode])

  // 专门监听新节点的添加，确保立即选择最新节点
  useEffect(() => {
    if (!fatherNodes || fatherNodes.length === 0 || isUserSelection.current) {
      return
    }

    const currentNodeCount = fatherNodes.length
    const hasNewNodes = currentNodeCount > lastNodeCount.current

    // 如果有新节点且不是人为选择，立即选择最新节点
    if (hasNewNodes && !isUserSelection.current) {
      const lastNodeIndex = fatherNodes.length - 1
      const lastNode = fatherNodes[lastNodeIndex]

      if (lastNode.start) {
        if (lastNode.children.length === 0) {
          // 如果最后一个节点没有子节点，直接选中它
          setSelectedNode({ nodeIndex: lastNodeIndex })
        } else {
          // 如果最后一个节点有子节点，展开它并选择最新的子节点
          setExpandedNodes(new Set([lastNodeIndex]))
          const lastChildIndex = lastNode.children.length - 1
          setSelectedNode({ nodeIndex: lastNodeIndex, childIndex: lastChildIndex })
        }
      }
    }
  }, [fatherNodes])

  // 监听选中节点的子节点变化（简化版，主要逻辑已在上面处理）
  useEffect(() => {
    if (!selectedNode || !fatherNodes || isUserSelection.current) {
      return
    }

    const { nodeIndex, childIndex } = selectedNode
    const node = fatherNodes[nodeIndex]

    if (!node || node.children.length === 0) {
      return
    }

    // 如果当前选中的是父节点，且有子节点，自动展开并选择最新子节点
    if (childIndex === undefined && node.children.length > 0) {
      // 找到最新的子节点（包括正在执行的）
      for (let i = node.children.length - 1; i >= 0; i--) {
        if (node.children[i].start) {
          setExpandedNodes(new Set([nodeIndex]))
          setSelectedNode({ nodeIndex, childIndex: i })
          break
        }
      }
    }
  }, [fatherNodes, selectedNode])

  const { total, current } = useAppSelector(chatNewSelectors.getJobCounts)

  const titleX = (node: TreeNode) => {
    const startEvent = node.start?.event
    const startName = node.start?.name
    if (
      startEvent === 'onAgentStart' &&
      (startName === 'planner_agent' || startName == 'search_planner_agent')
    ) {
      return t('workflow.understandProblem')
    }
    if (startEvent === 'onAgentStart' && startName === 'executor_agent') {
      return t('workflow.decomposeProblem')
    }
    return t('workflow.noTitleRecognized')
  }

  const toggleExpanded = (nodeIndex: number) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeIndex)) {
      newExpanded.delete(nodeIndex)
    } else {
      newExpanded.add(nodeIndex)
    }
    setExpandedNodes(newExpanded)
  }

  const toggleNodeExpanded = (nodeIndex: number) => {
    toggleExpanded(nodeIndex)
  }

  const handleNodeClick = (nodeIndex: number, childIndex?: number) => {
    // 标记为人为选择
    isUserSelection.current = true

    // 检查是否有子节点，如果有子节点则不允许选择父节点
    const node = fatherNodes[nodeIndex]
    if (node && node.children.length > 0 && childIndex === undefined) {
      // 如果有子节点，展开父节点并选择第一个子节点
      setExpandedNodes(new Set([nodeIndex]))
      if (node.children.length > 0) {
        setSelectedNode({ nodeIndex, childIndex: 0 })
      }
    } else {
      setSelectedNode({ nodeIndex, childIndex })
    }
  }
  const handleTitleClick = (node: TreeNode) => {
    const metadata = node?.end?.data?.metadata
    if (metadata?.url) {
      // openUrl(metadata.url)
    } else if (metadata?.source_path) {
      navigate(
        `/pdf?sourcePath=${encodeURIComponent(metadata.source_path)}&docId=${metadata?.document_id}`,
      )
    }
  }

  const handleSearchNodeClick = (nodeIndex: number, childIndex?: number) => {
    setSearchSelectedNode({ nodeIndex, childIndex })
  }

  const renderEndContent = () => {
    if (!selectedNode || !fatherNodes) return <div className={styles['end-empty']}></div>

    const { nodeIndex, childIndex } = selectedNode
    const node = fatherNodes[nodeIndex]

    if (!node) return <div className={styles['end-empty']}></div>

    // 如果选中的是子节点
    // TODO: rerank agent
    if (childIndex !== undefined) {
      const child = node.children[childIndex]
      if (!child) return <div className={styles['end-empty']}></div>

      return (
        <div className={styles['end-node']}>
          <div className={styles['end-node-title']}>
            {findRoundHasErrorAndEndByRunId(currentRound, child.start?.run_id) ? (
              <MatchIcon className={styles['match-icon-big']} />
            ) : (
              <LoadingIcon className="loading-spinner" />
            )}
            {child.start?.data?.action || t('workflow.subtaskComplete')}
          </div>
          <div className={styles['end-node-content']}>
            {getFlatChildren(child)?.length > 0 ? (
              getFlatChildren(child).map((grandChild, grandChildIndex) => (
                <div key={grandChildIndex} className={styles['end-action-item']}>
                  <div className={styles['action-title']}>
                    {/* web qa */}

                    {pathname === AppRoute.Search ? (
                      <div className={styles['match-icon']}>
                        <MatchIconRenderer content={grandChild.end?.data?.content} />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>

                  {grandChild.start?.data?.action !== 'Rerank' ? (
                    <div className={styles['content-text']}>
                      <div
                        className={styles['action-label']}
                        onClick={() => handleTitleClick(grandChild)}
                      >
                        {(() => {
                          if (grandChild.error) return null
                          if (!grandChild.end) return <LoadingIcon className="loading-spinner" />
                          return null
                        })()}
                        {grandChild.start?.data?.action || ''}
                      </div>
                      {grandChild.end ? <Agent agent={grandChild} /> : <></>}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ))
            ) : (
              <div
                className={classNames(styles['end-action-item'], styles['end-action-item-single'])}
              >
                {/* <div className={styles['action-label']}>{child.start?.data?.action || ''}</div> */}
                {/* route to llm_agent or Search agent */}
                {child.end ? (
                  <div className={styles['content-text']}>
                    <Agent agent={child} />
                  </div>
                ) : (
                  ''
                )}
              </div>
            )}
          </div>
        </div>
      )
    }

    // 如果选中的是父节点
    return (
      <div className={styles['end-node']}>
        <div className={styles['end-node-title']}>
          <MatchIcon className={styles['match-icon-big']} />

          {t('workflow.taskComplete')}
        </div>
        <div className={styles['end-node-content']}>
          {node.children.length === 0 ? (
            <div
              className={classNames(styles['end-action-item'], styles['end-action-item-single'])}
            >
              {/* <div className={styles['action-label']}>{node.start?.data?.action || ''}</div> */}
              {/* understand problem */}
              {node.end ? (
                <div className={styles['content-text']}>
                  <Agent agent={node} />
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            node.children.map((child, childIndex) => {
              if (child.children.length > 0) {
                return child.children.map((grandChild, grandChildIndex) => (
                  <div key={grandChildIndex} className={styles['end-action-item']}>
                    <div className={styles['action-label']}>
                      {grandChild.start?.data?.action || ''}
                    </div>
                    {grandChild.end ? (
                      <div className={styles['content-text']}>
                        {/* <OptimizedContentRenderer content={grandChild.end?.data?.content} /> */}
                        <Agent agent={grandChild} />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ))
              }
              return (
                <div
                  key={childIndex}
                  className={classNames(
                    styles['end-action-item'],
                    styles['end-action-item-single'],
                  )}
                >
                  <div className={styles['action-label']}>{child.start?.data?.action || ''}</div>
                  {child.end ? (
                    <div className={styles['content-text']}>
                      {/* <OptimizedContentRenderer content={child.end?.data?.content} /> */}
                      <Agent agent={child} />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  const renderSearchEndContent = () => {
    if (!searchSelectedNode || !fatherNodes) return <div className={styles['end-empty']}></div>
    const { nodeIndex, childIndex } = searchSelectedNode

    const node = fatherNodes[nodeIndex]

    if (!node) return <div className={styles['end-empty']}></div>

    // 如果选中的是子节点
    if (childIndex !== undefined) {
      const child = node.children.find((item) => {
        return item?.start?.task_id === childIndex
      })
      if (!child) return <div className={styles['end-empty']}></div>

      return (
        <div className={styles['end-node']}>
          <div className={styles['end-node-title']}>
            <MatchIcon className={styles['match-icon-big']} />
            {child.start?.data?.action || t('workflow.subtaskComplete')}
          </div>
          <div className={styles['end-node-content']}>
            {child.children.length > 0 ? (
              getFlatChildren(child).map((grandChild, grandChildIndex) => (
                <div key={grandChildIndex} className={styles['end-action-item']}>
                  <div className={styles['action-title']}>
                    {/* web qa */}

                    {/* <div className={styles['match-icon']}>
                      <MatchIconRenderer content={grandChild.end?.data?.content} />
                    </div> */}
                  </div>
                  <div className={styles['content-text']}>
                    {grandChild.end ? <Agent agent={grandChild} /> : ''}
                  </div>
                </div>
              ))
            ) : (
              <div
                className={classNames(styles['end-action-item'], styles['end-action-item-single'])}
              >
                {/* <div className={styles['action-label']}>{child.start?.data?.action || ''}</div> */}
                {/* route to llm_agent or Search agent */}
                {child.end ? (
                  <div className={styles['content-text']}>
                    <Agent agent={child} />
                  </div>
                ) : (
                  ''
                )}
              </div>
            )}
          </div>
        </div>
      )
    }

    // 如果选中的是父节点
    return (
      <div className={styles['end-node']}>
        <div className={styles['end-node-title']}>
          {findRoundHasEndByRunId(currentRound, node.start?.run_id) ? (
            <MatchIcon className={styles['match-icon-big']} />
          ) : (
            <LoadingIcon className="loading-spinner" />
          )}
          {t('workflow.searchValidate')}
        </div>
        <div className={styles['end-node-content']}>
          {node.children.length === 0 ? (
            <div
              className={classNames(styles['end-action-item'], styles['end-action-item-single'])}
            >
              {/* <div className={styles['action-label']}>{node.start?.data?.action || ''}</div> */}
              {/* understand problem */}
              {node.end ? (
                <div className={styles['content-text']}>
                  <Agent agent={node} />
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            node.children.map((child, childIndex) => {
              if (child.children.length > 0) {
                return getFlatChildren(child).map((grandChild, grandChildIndex) => (
                  <div key={grandChildIndex} className={styles['end-action-item']}>
                    {/* verifier_agent */}
                    {grandChild.end ? (
                      <div className={styles['content-text']}>
                        {/* <OptimizedContentRenderer content={grandChild.end?.data?.content} /> */}
                        <Agent agent={grandChild} />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ))
              }
              return (
                <div
                  key={childIndex}
                  className={classNames(
                    styles['end-action-item'],
                    styles['end-action-item-single'],
                  )}
                >
                  <div className={styles['action-label']}>{child.start?.data?.action || ''}</div>
                  {child.end ? (
                    <div className={styles['content-text']}>
                      {/* <OptimizedContentRenderer content={child.end?.data?.content} /> */}
                      <Agent agent={child} />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={classNames(styles['chat-start-wrapper'])}>
      {/* Workflow title */}
      <div className={styles['workflow-title']}>
        <div className={styles['workflow-title-text']}>{t('workflow.deepSearchWorkflow')}</div>
        {/* Statistics section */}
        <div className={styles['stats-section']}>
          <div className={styles['stats-container']}>
            <div className={styles['stat-item']}>
              <Statistic
                title={t('workflow.totalJobs')}
                value={total}
                valueStyle={{ color: '#1677ff', fontSize: '24px', fontWeight: 'bold' }}
              />
            </div>
            <div className={styles['stat-item']}>
              <Statistic
                title={t('workflow.currentJobs')}
                value={total - current}
                valueStyle={{ color: '#fa8c16', fontSize: '24px', fontWeight: 'bold' }}
              />
            </div>
            <div className={styles['stat-item']}>
              <Statistic
                title={t('workflow.completeJobs')}
                value={current}
                valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
              />
            </div>
          </div>
        </div>
      </div>

      {pathname === AppRoute.Chat && (
        <div className={styles['chat-start-list']}>
          {fatherNodes?.map((node, index) => (
            <div
              key={index}
              className={classNames(styles['start-node'], {
                [styles['selected-expanded']]:
                  selectedNode?.nodeIndex === index && expandedNodes.has(index),
              })}
            >
              <div
                className={classNames(styles['start-node-title'], styles['clickable'], {
                  [styles['selected']]:
                    selectedNode?.nodeIndex === index && selectedNode?.childIndex === undefined,
                })}
                onClick={() => {
                  // 如果有子节点，只允许展开/折叠，不允许选择
                  if (node.children.length > 0) {
                    toggleNodeExpanded(index)
                  } else {
                    // 如果没有子节点，允许选择
                    handleNodeClick(index)
                  }
                }}
              >
                <div className={styles['start-node-title-text']}>
                  <span className={styles['task-number']}>#{index + 1}</span>
                  {findRoundHasEndByRunId(currentRound, node.start?.run_id) ? (
                    <MatchIcon className={styles['match-icon']} />
                  ) : (
                    <LoadingIcon className="loading-spinner" />
                  )}
                  <span className={styles['task-title']}>{titleX(node)}</span>
                </div>
                {node.children.length > 0 && (
                  <div
                    className={styles['expand-icon']}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpanded(index)
                    }}
                  >
                    {expandedNodes.has(index) ? <UpOutlined /> : <DownOutlined />}
                  </div>
                )}
              </div>

              {expandedNodes.has(index) && node.children.length > 0 && (
                <div className={styles['children-container']}>
                  {node.children.map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className={classNames(styles['child-node'], styles['clickable'], {
                        [styles['selected']]:
                          selectedNode?.nodeIndex === index &&
                          selectedNode?.childIndex === childIndex,
                      })}
                      onClick={() => handleNodeClick(index, childIndex)}
                    >
                      <div className={styles['child-node-title']}>
                        <div className={styles['child-left']}>
                          <span className={styles['child-prefix']}>#</span>
                          <span className={styles['child-title']}>
                            {child.start?.data?.action || ''}
                          </span>
                        </div>
                        {findRoundHasEndByRunId(currentRound, child.start?.run_id) ? (
                          <MatchIcon className={styles['match-icon-big']} />
                        ) : (
                          <LoadingIcon className="loading-spinner" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pathname !== AppRoute.Home && (
        <TaskAnalysis
          fatherNodes={fatherNodes || []}
          selectedNode={searchSelectedNode}
          onNodeClick={handleSearchNodeClick}
          selectedTaskIndex={searchSelectedNode?.childIndex}
        />
      )}

      {/* Task execution details title */}
      <div className={styles['detail-title']}>{t('workflow.taskExecutionDetails')}</div>

      {/* Task execution details content */}
      <div className={styles['end-content']}>
        {pathname === AppRoute.Home && renderEndContent()}
        {pathname !== AppRoute.Home && renderSearchEndContent()}
      </div>
    </div>
  )
}

export default ChatStep
