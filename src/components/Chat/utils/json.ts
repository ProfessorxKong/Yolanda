/**
 * 从 Markdown 内容中提取并解析 JSON 数据
 * @param markdownContent - 包含 JSON 的 Markdown 字符串
 * @returns 解析后的 JSON 对象，解析失败返回 null
 */
export const extractJsonFromMarkdown = (markdownContent: string): any => {
  if (!markdownContent || typeof markdownContent !== 'string') {
    return null;
  }

  try {
    // 方法1: 尝试匹配 ```json ... ``` 格式
    const jsonCodeBlockMatch = markdownContent.match(/```json\s*\n([\s\S]*?)```/);
    if (jsonCodeBlockMatch && jsonCodeBlockMatch[1]) {
      const jsonString = jsonCodeBlockMatch[1].trim();
      return JSON.parse(jsonString);
    }

    // 方法2: 尝试匹配 ``` ... ``` 格式（无语言标识）
    const codeBlockMatch = markdownContent.match(/```\s*\n([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      const jsonString = codeBlockMatch[1].trim();
      return JSON.parse(jsonString);
    }

    // 方法3: 清理内容并尝试解析
    const cleanedContent = markdownContent
      .replace(/^```json\s*\n?/, '') // 移除开头的 ```json
      .replace(/\n?```$/, '') // 移除结尾的 ```
      .replace(/\\n/g, '\n') // 转换转义的换行符
      .replace(/\\"/g, '"') // 转换转义的引号
      .replace(/\\t/g, '\t') // 转换转义的制表符
      .trim();

    if (cleanedContent) {
      return JSON.parse(cleanedContent);
    }

    return JSON.parse(markdownContent);
  } catch (error) {
    console.warn('JSON parsing failed:', error);
    return null;
  }
};

/**
 * 安全地解析 JSON 字符串
 * @param jsonString - JSON 字符串
 * @param defaultValue - 解析失败时的默认值
 * @returns 解析后的对象或默认值
 */
export const safeJsonParse = <T = any>(jsonString: string, defaultValue: T): T => {
  if (!jsonString || typeof jsonString !== 'string') {
    return defaultValue;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Safe JSON parsing failed:', error);
    return defaultValue;
  }
};

/**
 * 检查字符串是否为有效的 JSON 格式
 * @param jsonString - 待检查的字符串
 * @returns 是否为有效 JSON
 */
export const isValidJson = (jsonString: string): boolean => {
  if (!jsonString || typeof jsonString !== 'string') {
    return false;
  }

  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};
