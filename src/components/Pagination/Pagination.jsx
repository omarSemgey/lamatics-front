import './pagination.css'
import { Link } from 'react-router-dom'

export default function Pagination({ page, lastPage, path }) {
    return(
        <>
        <div className='pagination'>
            <Link to={`${path}/page/1`} className='box'><span>&lt; &lt;</span></Link>
            <Link to={`${path}/page/${page > 1 ? page-1 : page || 1}`} className='box'><span>&lt;</span></Link>
            <Link to={`${path}/page/2`} className='box'><span>2</span></Link>
            <Link to={`${path}/page/3`} className='box'><span>3</span></Link>
            <Link to={`${path}/page/4`} className='box'><span>4</span></Link>
            <Link to={`${path}/page/${Number(page) < lastPage ? Number(page) +1 : page || 1}`} className='box'><span>&gt;</span></Link>
            <Link to={`${path}/page/${lastPage}`} className='box'><span>&gt; &gt;</span></Link>
        </div>
        </>
    )
}