import classNames from 'classnames';
import styles from './index.module.scss';
import LLM from './components/LLM';
import Verifier from './components/Verifier';
import { useLocation } from 'react-router-dom';
import { AppRoute } from '@/router';

interface ChatMainProps extends React.HTMLAttributes<HTMLDivElement> {
  type: string; // '/search' | '/chat' | '/pdf';
}

const ChatMain = (props: ChatMainProps): JSX.Element => {
  const { type } = props;
  const location = useLocation();

  return (
    <div id="chat-main" className={classNames(styles['chat-main'], props.className)}>
      {location.pathname !== AppRoute.Search && <LLM type={type} />}
      {location.pathname === AppRoute.Search && <Verifier />}
    </div>
  );
};

export default ChatMain;
