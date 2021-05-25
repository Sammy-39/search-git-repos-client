import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

import noImage from '../assets/no-image.png'
import '../Styles/CommitList.css'

const CommitList = ({ commits, repoName, reposPageSelected, reposSetPageSelected,
    setShowCommits, setCommitsData, }) =>{

    const [data, setData] = useState([])
    const [perPage] = useState(5)
    const [pageCount, setPageCount] = useState(0)

    useEffect(()=>{
        window.scrollTo(0, 0); 
    },[])

    useEffect(()=>{
        setData(commits.slice(0, perPage))
        setPageCount(Math.ceil(commits.length/perPage))
    },[commits, perPage])

    const handleMoveBack = () =>{
        setCommitsData({})
        reposSetPageSelected(reposPageSelected)
        setShowCommits(false)
    }

    const handlePageClick = async (e) =>{
        const selectedPage = e.selected
        setData(commits.slice(selectedPage*perPage, (selectedPage*perPage) + perPage))
    }

    return(
        <>
        <div className='commits'>
            <i className="material-icons" onClick={handleMoveBack}>
                arrow_back
            </i>
            <p> {repoName}/commits </p>
            {
                data.map((commit)=>(
                    <div className='commit' key={commit.sha}>
                        <div className='commit-author-profile'>
                            <a href={commit.authorProfileURL} target='_blank' rel="noreferrer"> 
                                <img src={commit.authorAvatar ?? noImage} alt='' /> 
                            </a>
                            <div className='author-profile'>
                                <p> {commit.authorName} </p>
                                <a href={commit.authorProfileURL} target='_blank' rel="noreferrer"> 
                                    <p> { commit.authorId?'@'+commit.authorId:''} </p>
                                </a>
                            </div>
                        </div>
                        <p> sha: <a href={commit.commitURL} target='_blank' rel="noreferrer">  
                                {commit.sha} 
                            </a> 
                        </p>
                        <p> Commit message: {commit.message} </p>
                    </div>
                ))
            }
        </div>
        {
            data.length!==0 && 
            <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination commit-paginate"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
            />
        }
        </>
    )
}

export default CommitList