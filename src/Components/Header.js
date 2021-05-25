import gitLogo from '../assets/github.png'
import '../Styles/Header.css'

const Header = () =>{
    return(
        <div className='header'>
            <nav>
                <div className='nav-wrapper nav'>
                    <img className='nav-logo' src={gitLogo} alt='' />
                    <a href='!#' className='nav-title'> Search Git Repos </a>
                </div>
            </nav>
        </div>
    )
}

export default Header