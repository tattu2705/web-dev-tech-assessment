export interface SearchBarProps {
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
