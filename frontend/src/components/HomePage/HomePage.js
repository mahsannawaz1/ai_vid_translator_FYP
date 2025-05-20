import React,{ useRef } from 'react';
import './HomePage.css';
import Navbar from './NavBar';
import Hero from './Hero';
import Products from './Products';
import Tutorial from './Tutorial';
import Users from './Users';
import Faqs from './Faqs';

const HomePage = ({setAuthToken}) => {
    const faqRef = useRef(null);
    const productsRef = useRef(null);
    const tutorialRef = useRef(null);
    const handleScroll = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth' })
    return (
        <>
            <Navbar 
                onFaqClick={() => handleScroll(faqRef)} 
                onProductsClick={() => handleScroll(productsRef)} 
                onTutorialClick={() => handleScroll(tutorialRef)} 
                setAuthToken={setAuthToken}
            />
            <Hero />
            <Products productsRef={productsRef} />
            <Tutorial tutorialRef={tutorialRef} />
            <Users />
            <Faqs faqRef={faqRef} />
        </>

    )
}

export default HomePage