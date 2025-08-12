import { Tooltip } from 'antd';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

interface TruncatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
  title: string;
}

const TruncatedText = (props: TruncatedTextProps) => {
  const { title, children, className, ...restProps } = props;
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        setIsTruncated((element as HTMLElement).scrollWidth > (element as HTMLElement).clientWidth);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [title]);

  return (
    <div
      {...restProps}
      className={classNames(className)}
      ref={props.ref}
      style={{
        flex: '1 1 auto',
        overflow: 'hidden',
        minWidth: 0,
        ...restProps.style,
      }}
    >
      <Tooltip
        overlayStyle={{ zIndex: 9999 }}
        title={title}
        placement="top"
        open={isTruncated ? undefined : false}
      >
        <div
          ref={textRef}
          style={{
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0,
          }}
        >
          {children}
        </div>
      </Tooltip>
    </div>
  );
};

export default TruncatedText;
