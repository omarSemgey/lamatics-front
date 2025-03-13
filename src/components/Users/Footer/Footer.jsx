import './Footer.css';


export default function Footer(){
    const date = new Date().getFullYear();
    return(
        <>
        <div className='footer'>
            <p className='secondary-text'>Copyright © {date} All rights reserved | Made by <a href="https://github.com/omarSemgey">Omar Semgey.</a></p>
        </div>
        </>
    )
}