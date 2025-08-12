/**
 * 从 Markdown 文本中提取 JSON 数据
 * @param content 包含 JSON 的 Markdown 文本
 * @returns 解析后的 JSON 对象，如果解析失败则返回 null
 */
export const extractJsonFromMarkdown = (content: string): any => {
  try {
    // 匹配 ```json 和 ``` 之间的内容
    const match = content.match(/```json\n([\s\S]*?)```/)
    if (match && match[1]) {
      return JSON.parse(match[1].trim())
    }
    // 如果没有找到markdown格式，尝试直接解析
    return JSON.parse(content)
  } catch (e) {
    // console.error('解析JSON失败:', e);
    // console.log(content, 'Error Content');
    return null
  }
}
