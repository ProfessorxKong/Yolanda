import type { Components } from 'react-markdown';
// import { QuestionSection } from '../QuestionSection';
// import { processQuestionText } from '../questionUtils';
import Image from '../Image';

interface MarkdownComponentsConfig {
  isChatPage: boolean;
}

export const createMarkdownComponents = ({ isChatPage }: MarkdownComponentsConfig): Components => {
  return {
    img: ({ src, alt, ...props }) => {
      // Only use image cache logic in chat page
      if (isChatPage) {
        return <Image srcPath={src} alt={alt} {...props} />;
      }
      // Fallback to regular img tag for non-chat pages
      return <img src={src} alt={alt} {...props} />;
    },
    // p: ({ children, ...props }) => {
    //   const text = children;
    //   if (typeof text === 'string') {
    //     const questionData = processQuestionText(text);
    //     if (questionData) {
    //       return (
    //         <QuestionSection
    //           before={questionData.before}
    //           marker={questionData.marker}
    //           after={questionData.after}
    //           processText={text => <div dangerouslySetInnerHTML={{ __html: text }} />}
    //         />
    //       );
    //     }
    //   }
    //   return <p {...props}>{children}</p>;
    // },
    p: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <p {...props}>{children}</p>;
      }
      return <p {...props}>{children}</p>;
    },
    h1: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <h1 {...props}>{children}</h1>;
      }
      return <h1 {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <h2 {...props}>{children}</h2>;
      }
      return <h2 {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <h3 {...props}>{children}</h3>;
      }
      return <h3 {...props}>{children}</h3>;
    },
    h4: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <h4 {...props}>{children}</h4>;
      }
      return <h4 {...props}>{children}</h4>;
    },
    h5: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <h5 {...props}>{children}</h5>;
      }
      return <h5 {...props}>{children}</h5>;
    },
    h6: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <h6 {...props}>{children}</h6>;
      }
      return <h6 {...props}>{children}</h6>;
    },
    li: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <li {...props}>{children}</li>;
      }
      return <li {...props}>{children}</li>;
    },
    blockquote: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <blockquote {...props}>{children}</blockquote>;
      }
      return <blockquote {...props}>{children}</blockquote>;
    },
    td: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <td {...props}>{children}</td>;
      }
      return <td {...props}>{children}</td>;
    },
    th: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return <th {...props}>{children}</th>;
      }
      return <th {...props}>{children}</th>;
    },
  };
};
