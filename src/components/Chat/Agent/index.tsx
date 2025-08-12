import React from 'react'
import LLMAgent from './LLM'
import SearchAgent from './Search'
import WebSearch from './WebSearch'
import Planner from './Planner'
import Verifier from './Verifier'
import { MessageContent } from '@/store/slices/chatNew'

interface AgentProps {
  agent?: {
    end?: MessageContent
  }
}

const Agent: React.FC<AgentProps> = ({ agent }) => {
  if (!agent?.end) {
    return null
  }

  // 根据agent类型路由到不同的组件
  if (agent.end.name === 'llm_agent') {
    return <LLMAgent end={agent.end} />
  } else if (agent.end.name === 'search') {
    return <SearchAgent end={agent.end} />
  } else if (agent.end.name === 'web_search') {
    return <WebSearch end={agent.end} />
  } else if (agent.end.name === 'planner_agent') {
    return <Planner end={agent.end} />
  } else if (agent.end.name === 'verification') {
    return <Verifier end={agent.end} />
  } else {
    return null
  }
}

export default Agent
