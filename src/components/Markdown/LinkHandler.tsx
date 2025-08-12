import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { openUrl } from '@tauri-apps/plugin-opener';

const LinkHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLinkClick = async (event: MouseEvent) => {
      // console.log('Link click event triggered'); // 添加调试日志
      // 获取点击的元素
      const target = event.target as HTMLElement;
      // console.log('Clicked element:', target); // 添加调试日志

      // 检查是否是链接元素或其子元素
      const linkElement = target.closest('a');
      // console.log('Link element found:', linkElement); // 添加调试日志
      if (!linkElement) return;

      // 获取链接的href
      const href = linkElement.getAttribute('href');
      // console.log('Link href:', href); // 添加调试日志
      if (!href) return;

      // 检查是否是http或https链接
      if (href.startsWith('http://') || href.startsWith('https://')) {
        // 阻止默认行为
        event.preventDefault();

        try {
          // console.log('Creating new window for URL:', href);
          // 打开浏览器新窗口
          await openUrl(href);
        } catch (error) {
          console.error('创建新窗口失败:', error);
        }
      }
    };

    // 添加全局点击事件监听器
    document.addEventListener('click', handleLinkClick);

    // 清理函数
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [navigate]);

  return null; // 这个组件不需要渲染任何内容
};

export default LinkHandler;
