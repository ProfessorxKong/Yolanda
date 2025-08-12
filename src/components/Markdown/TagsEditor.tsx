import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Flex, Tag, theme, Tooltip } from 'antd';
import type { BaseSelectRef } from 'rc-select';
import { useNoteThunks } from '@/hooks/useNoteThunks';

interface TagsEditorProps {
  collectionId: string;
  initialTags: string[];
  onTagsChange: (newTags: string[]) => void;
}

const tagInputStyle: React.CSSProperties = {
  width: 78,
  height: 22,
  verticalAlign: 'top',
};

const TagsEditor: React.FC<TagsEditorProps> = ({ collectionId, initialTags, onTagsChange }) => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>(initialTags);
  const [allTags, setAllTags] = useState<{ value: string }[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<BaseSelectRef>(null);

  const { getNoteCollectionTags } = useNoteThunks();

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  useEffect(() => {
    if (collectionId) {
      getNoteCollectionTags(collectionId)
        .unwrap()
        .then((result: string[]) => {
          if (result) {
            setAllTags(result.map((tag: string) => ({ value: tag })));
          }
        })
        .catch((error: any) => {
          console.error('Failed to fetch tags:', error);
        });
    }
  }, [collectionId, getNoteCollectionTags]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
    onTagsChange(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSelectConfirm = (value: string) => {
    if (value && !tags.includes(value)) {
      const newTags = [...tags, value];
      setTags(newTags);
      onTagsChange(newTags);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      onTagsChange(newTags);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: token.colorBgContainer,
    borderStyle: 'dashed',
    cursor: 'pointer',
  };

  return (
    <Flex gap="4px 0" wrap>
      {tags.map(tag => {
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag key={tag} closable style={{ userSelect: 'none' }} onClose={() => handleClose(tag)}>
            <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        <AutoComplete
          ref={inputRef}
          options={allTags}
          style={tagInputStyle}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onSelect={handleSelectConfirm}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleInputConfirm();
            }
          }}
          placeholder="输入Tag"
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      ) : (
        <Tag style={tagPlusStyle} icon={<PlusOutlined />} onClick={showInput}>
          Tag
        </Tag>
      )}
    </Flex>
  );
};

export default TagsEditor;
