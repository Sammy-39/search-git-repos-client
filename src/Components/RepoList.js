import { useEffect, useState } from 'react'
import M from 'materialize-css'
import ReactPaginate from 'react-paginate'

import Spinner from './Spinner'
import CommitList from './CommitList'
import '../Styles/RepoList.css'

const RepoList = ({ userName, repos })=>{

    const [commitsData, setCommitsData] = useState({})

    const [data,setData] = useState([])
    const [perPage] = useState(5)
    const [pageCount, setPageCount] = useState(0)
    const [pageSelected, setPageSelected] = useState(0)

    const [showCommits , setShowCommits] = useState(false)
    const [loading, setLoading] = useState(Array(repos?.length).fill(false))

    useEffect(()=>{
        setData(repos?.slice(0, perPage))
        setPageCount(Math.ceil(repos?.length/perPage))
    },[repos, perPage])

    const handleCommitsFetch = async (repoName,index) =>{
        setLoading((prevState)=>prevState.map((item,i)=>i===index?true:item))
        try{
            const res = await fetch(`https://search-git-repos-server.herokuapp.com/api/get-commits/${userName}/${repoName}`)
            const resData = await res.json()
            if(res.status===200){
                setCommitsData(resData)
                setShowCommits(true)
                setLoading((prevState)=>prevState.map((item,i)=>i===index?false:item))
            }
            else{
                setLoading((prevState)=>prevState.map((item,i)=>i===index?false:item))
                M.toast({
                    html: resData.message, 
                    classes: '#ff3d00 deep-orange accent-3', 
                    displayLength: 2000
                })
            }
        }
        catch(err){
            setLoading((prevState)=>prevState.map((item,i)=>i===index?false:item))
            M.toast({
                html: 'Connection Timeout!', 
                classes: '#ff3d00 deep-orange accent-3', 
                displayLength: 2000
            })
        }
    }

    const handlePageClick = async (e) =>{
        const selectedPage = e.selected
        setPageSelected(selectedPage)
        setData(repos?.slice(selectedPage*perPage, (selectedPage*perPage) + perPage))
    }

    return(
        <>
        <div className='repo-commits-list'>
            {   
                !showCommits &&
                data?.map((repo,index)=>(
                    <div className='repo' key={repo.repoName}>
                        {loading[index] && <Spinner />}
                        <div className='repo-header'>
                            <a href={repo.repoURL} target='_blank' rel='noreferrer'> 
                                {userName}/{repo.repoName} 
                            </a>
                            <p onClick={()=>handleCommitsFetch(repo.repoName,index)}> 
                                View Commits 
                            </p>
                        </div>
                        <p> Description - <span> {repo.desc ?? 'Not Available'} </span> </p>
                        <p> Clone URL - <span> {repo.cloneURL} </span> </p>
                        <div className='repo-footer'> 
                            <p> <i className="material-icons">code</i> {repo.language ?? 'Markdown'} </p>
                            <p> <i className="material-icons">mediation</i> {repo.forksCount} </p>
                            <p> <i className="material-icons">save</i> {repo.size}kbs </p>
                        </div>
                    </div>
                ))
            }
            {
                showCommits &&
                <CommitList commits={commitsData.repoCommits} setCommitsData={setCommitsData} reposPageSelected={pageSelected}
                repoName={commitsData.repoName} setShowCommits={setShowCommits} reposSetPageSelected={setPageSelected} />
            }
        </div>
        {
            !showCommits && 
            <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                initialPage={pageSelected}
            />
        }
        </>
    )
}

export default RepoList