import { useEffect } from 'react';

const useEnter = (onEnter) => {
    useEffect(() => {
        const handleEnter = (event) => {
            if (event.keyCode === 13) 
                onEnter();
        };
        window.addEventListener('keydown', handleEnter);

        return () => {
            window.removeEventListener('keydown', handleEnter);
        };
    }, [onEnter]);
}

export default useEnter