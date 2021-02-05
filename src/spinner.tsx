import React from 'react'
// react spinner 
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'

export default function Loader(){
    return(
        <div className='loader-center'>
            <ClimbingBoxLoader color={'#FFC043'} />
            <h6>Loading ....</h6>
        </div>
    )
}