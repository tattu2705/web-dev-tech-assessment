import { Space, Input } from 'antd'
import React from 'react'

const { Search } = Input

interface SearchBarProps {
  onSearch?: (value: string) => void
  placeholder?: string
  allowClear?: boolean
  enterButton?: React.ReactNode
  size?: 'large' | 'middle' | 'small'
  style?: React.CSSProperties
  value: string
  onChange?: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClear?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, allowClear, enterButton, size, onSearch, style, value, onChange, onKeyDown, onClear }) => {

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
      />
    </Space>
  )
}

export default SearchBar