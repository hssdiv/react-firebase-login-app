import React from 'react'
import '../styles/App.css';

function SimpleErrorMessage(props) {

    const [error, setError] = React.useState(null)

    React.useEffect(() => {
        setError(props.error)
    }, [props, props.error])

    const handleCloseButton = () => {
        setError(null);
        if(props.callback) {
            props.callback(null);
        }
    }
    return (

        <div className='error' onClick={handleCloseButton}>
            {error &&
                <>
                    {error + ' '}
                    <span>
                        &#10006;
                    </span>
                </>
            }


        </div>

    )
}

export default SimpleErrorMessage
