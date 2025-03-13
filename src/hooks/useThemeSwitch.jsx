export default function useThemeSwitch() {
    const theme = localStorage.getItem('theme');

    if(theme == 'dark'){
        localStorage.setItem('theme','light');

        document.body.classList.remove('dark');

        document.body.classList.add('light');
    }
    else if(theme == 'light'){
        localStorage.setItem('theme','dark');

        document.body.classList.remove('light');

        document.body.classList.add('dark');
    }
    else{
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if(prefersDarkMode) {
            localStorage.setItem('theme','light');

            document.body.classList.remove('dark');

            document.body.classList.add('light');
        }else{
            localStorage.setItem('theme','dark');

            document.body.classList.remove('light');

            document.body.classList.add('dark');    
        }
    }
}