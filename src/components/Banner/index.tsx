import LogoIcon from '../../assets/icons/LogoIcon'
import './index.css'

const Banner = () => {
  return (
    <div className='banner'>
      <div className='banner-wrapper'>
        <LogoIcon />
        <div>
          An Official Website of the{" "}
          <span className="bold-text">Singapore Government</span>
        </div>
      </div>
    </div>
  )
}

export default Banner