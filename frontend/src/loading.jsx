import React from 'react';
import loader from './assets/images/loading.gif';

const Loading = () => {
    return (
        <div className='w-full flex text-center justify-center'>
            <img src ={loader.src} className='loader'/>
        </div>
    )
}

export default Loading;