import { useImageCache } from '@/hooks/useImageCache';
import { useEffect } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcPath?: string;
  alt?: string;
}

const Image = (props: ImageProps) => {
  const { srcPath, alt } = props;
  const { loadImage, getImageStatus } = useImageCache();

  const { isLoading, imageUrl, error } = getImageStatus(srcPath || '');
  useEffect(() => {
    if (srcPath && !isLoading && !imageUrl && !error) {
      loadImage(srcPath);
    }
  }, [srcPath, isLoading, imageUrl, error, loadImage]);

  if (isLoading) {
    return (
      <div
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          margin: '4px 0',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
        }}
      >
        <div style={{ color: '#666', fontSize: '12px' }}>加载图片中...</div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          margin: '4px 0',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
        }}
      >
        <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
          图片: {alt || '无标题'}
        </div>
        <div style={{ color: '#999', fontSize: '11px', fontFamily: 'monospace' }}>
          路径: {srcPath}
        </div>
        <div style={{ color: '#ff6b6b', fontSize: '11px' }}>加载失败: {error || '未知错误'}</div>
      </div>
    );
  }

  return (
    <div style={{ margin: '8px 0' }}>
      <img
        src={imageUrl}
        alt={alt || '图片'}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        {...props}
      />
      {alt && (
        <div
          style={{
            color: '#666',
            fontSize: '11px',
            marginTop: '4px',
            textAlign: 'center',
          }}
        >
          {alt}
        </div>
      )}
    </div>
  );
};

export default Image;
