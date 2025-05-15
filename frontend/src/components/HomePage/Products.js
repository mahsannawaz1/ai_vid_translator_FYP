import React from 'react'
import img from '../../assets/img.jpg';

const Products = ({productsRef}) => {
    return (
        <div className='my-3' ref={productsRef}>
            <h3 className='text-center'>Our Products</h3>
            <div className='d-flex justify-content-center align-items-center p-2 card-container'>
                <div className='product-card'>
                    <img src={img} />
                    <div className='product-card-body px-2 pt-2 pb-4'>
                        <p className='card-body-header m-0 py-2'>AI Powered Video Translator</p>
                        <p className='card-body-content m-0 pb-5'>Elevate your global reach with Pixel AI. Seamlessly translate videos into multiple languages with good enough lip-syncing.</p>
                        <a href="#" className="translate-btn">Convert Now</a>
                    </div>
                </div>
            
            </div>
        </div>
    )
}

export default Products