import {  useEffect } from 'react';

export default function useDetectTheme() {
    useEffect(() => {
        const theme = localStorage.getItem('theme');

        if(theme == 'dark'){
            localStorage.setItem('theme','dark');
            
            document.body.classList.remove('light');
            
            document.body.classList.add('dark');
        }else if(theme == 'light'){
            localStorage.setItem('theme','light');

            document.body.classList.remove('dark');
    
            document.body.classList.add('light');
        }
    },[]);
}