import React from 'react'
import Dogo from './Dogo'
import GetWidth from '../ui/useWindowSize'

function Dogos() {
    const currentScreenWidth = GetWidth()

    return (
        <div>
            <h1>Dogos page</h1>
                <div 
                    className='dogoCardContainer'
                    style={ currentScreenWidth > 1066 ? {} : { maxWidth: '533px' } }  >
                    <Dogo />
                    <Dogo />
                    <Dogo />
                    <Dogo />
                    <Dogo />
                    <Dogo />
                    <Dogo />
                    <Dogo />
                    <Dogo />
                </div>
        </div>
    )
}

export default Dogos
