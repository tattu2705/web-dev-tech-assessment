import { Space, Input } from 'antd'
import React from 'react'
import { SearchBarProps } from '../../types/search-bar'

const { Search } = Input

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, allowClear, enterButton, size, onSearch, style, value, onChange, onKeyDown, onClear, className }) => {

  return (
    <Space>
      <Search
        value={value}
        placeholder={placeholder}
        allowClear={allowClear}
        enterButton={enterButton}
        size={size}
        onChange={(e) => onChange?.(e.target.value)}
        onSearch={onSearch}
        onKeyDown={onKeyDown}
        onClear={onClear}
        style={style}
        className={className}
        data-testid="search-input"
      />
    </Space>
  )
}

export default SearchBar