import { visit } from 'unist-util-visit';
import type { Root } from 'hast';
import styles from '../MarkdownRenderer.module.scss';

/**
 * Custom rehype plugin to handle reference marks
 * Converts text patterns like <|1,2,3|> into clickable reference icons
 */
export const rehypeReferenceIcons = () => {
  return (tree: Root): void => {
    visit(tree, 'text', node => {
      if (typeof node.value === 'string') {
        // Debug logging for image links
        // if (node.value.includes('![') && node.value.includes('](') && node.value.includes(')')) {
        //   console.log('Found image link in text:', node.value);
        // }

        const parts = node.value.split(/(<\|([\d,]+)\|>)/g);
        if (parts.length > 1) {
          const newNodes = parts
            .map((part, index) => {
              const match = part.match(/<\|([\d,]+)\|>/);
              if (match) {
                const numbers = match[1].split(',').map(n => parseInt(n.trim()));
                const validNumbers = numbers.filter(n => !isNaN(n) && n >= 0 && n <= 99);

                if (validNumbers.length > 0) {
                  return {
                    type: 'element',
                    tagName: 'span',
                    properties: {},
                    children: validNumbers.map(num => ({
                      type: 'element',
                      tagName: 'span',
                      properties: {
                        className: [styles.referenceIcon],
                        'data-reference-id': num.toString(),
                      },
                      children: [
                        {
                          type: 'text',
                          value: num.toString(),
                        },
                      ],
                    })),
                  };
                }
                return null;
              }

              // If current part is not a reference mark and previous part is a reference mark, skip this part
              if (index > 0 && parts[index - 1].match(/<\|([\d,]+)\|>/)) {
                return null;
              }

              return {
                type: 'text',
                value: part,
              };
            })
            .filter(Boolean);

          // Replace original node
          Object.assign(node, {
            type: 'element',
            tagName: 'span',
            properties: {},
            children: newNodes,
          });
        }
      }
    });
  };
};
