import { useState } from 'react'
import M from 'materialize-css'

import Loader from '../Components/Loader'
import '../Styles/search.css'
import search from '../assets/search.jpg'
import RepoList from '../Components/RepoList'

const Search = () =>{

    const [username, setUsername] = useState('')

    const [data,setData] = useState({})

    const [disable, setDisable] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleRepoSearch = async (e) =>{
        e.preventDefault()
        M.Toast.dismissAll()
        if(loading){ return }
        if(!username){ 
            M.toast({
                html: 'User Name is required!', 
                classes: '#ff3d00 deep-orange accent-3', 
                displayLength: 2000
            }) 
        }
        else{
            setLoading(true)
            setDisable(true)
            try{
                const res = await fetch(`https://search-git-repos-server.herokuapp.com/api/get-repos/${username}`)
                const resData = await res.json()
                setLoading(false)
                setDisable(false)
                if(res.status===200){
                    setUsername('')
                    setData(resData)
                }
                else{
                    M.toast({
                        html: 'User not found!', 
                        classes: '#ff3d00 deep-orange accent-3', 
                        displayLength: 2000
                    })
                }
            }
            catch(err){
                setLoading(false)
                setDisable(false)
                M.toast({
                    html: 'Connection Timeout!', 
                    classes: '#ff3d00 deep-orange accent-3', 
                    displayLength: 2000
                })
            }
        }
    }

    return(
        <div className='search'>
            { loading && <Loader />}
            <div className='search-bar'>
                <form className='search-form' onSubmit={(e)=>handleRepoSearch(e)}>
                    <input type='text' className="browser-default" placeholder="User Name" required
                    value={username} onChange={(e)=>setUsername(e.target.value)} disabled={disable} />
                    <i className="material-icons search-icon" onClick={(e)=>handleRepoSearch(e)}>search</i>
                </form>
                { data.length!==0 ? <i className="material-icons" onClick={()=>setData([])}>clear</i>:''}
            </div>
            {
                !data.repos ?
                <div className='no-records'>
                    <img src={search} alt='' />  
                    <p> No data available! </p>
                    <p> Search with github user-name to find repos </p>
                </div> :
                <div className="records">
                    <div className='profile'>
                        <a href={data.profileURL} target='_blank' rel='noreferrer'> 
                            <img src={data.avatarURL} alt='' /> 
                        </a>
                        <a href={data.profileURL} target='_blank' rel='noreferrer'> 
                            @{data.userName} 
                        </a>
                    </div>
                   <RepoList repos={data.repos} userName={data.userName} />
                </div>
            }
        </div>
    )
}

export default Search