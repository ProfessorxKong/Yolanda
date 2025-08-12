export const getPrimaryDomain = (url: string): string | null => {
  try {
    const domain = new URL(url).hostname;

    // 使用原生方法提取主域名
    // 简单的逻辑：取最后两个部分作为主域名
    const parts = domain.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }

    return domain;
  } catch (e) {
    console.error('Invalid URL:', e);
    return null;
  }
};
