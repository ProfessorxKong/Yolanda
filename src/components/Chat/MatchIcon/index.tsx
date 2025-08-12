import React from 'react'
import { extractJsonFromMarkdown } from '../utils/json'

interface MatchIconProps {
  content?: string
}

const MatchIcon: React.FC<MatchIconProps> = ({ content }) => {
  if (typeof content === 'string' && content.startsWith('```json')) {
    return <>{extractJsonFromMarkdown(content || '')}</>
  }

  return <></>
}

export default MatchIcon
