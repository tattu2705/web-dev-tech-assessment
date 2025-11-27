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
  onChange?: (value: string) 
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, allowClear, enterButton, size, onSearch, style, value, onChange }) => {
  
  return (
    <Space>
      <Search
        value={value}
        placeholder={placeholder}
        allowClear={allowClear}
        enterButton={enterButton}
        size={size}
        onChange={onChange}
        onSearch={onSearch}
        style={style}
      />
    </Space>
  )
}

export default SearchBar