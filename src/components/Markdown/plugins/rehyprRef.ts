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
        const matches = [...node.value.matchAll(/\[citation:(\d{1,2})\]/g)];

        if (matches.length > 1) {
          const newNodes = matches
            .map(part => {
              const numbers = [part[1]];

              if (numbers.length > 0) {
                return {
                  type: 'element',
                  tagName: 'span',
                  properties: {},
                  children: numbers.map(num => ({
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
