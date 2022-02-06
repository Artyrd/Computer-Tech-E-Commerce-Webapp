import { Card, CardContent } from '@mui/material';
import React from 'react';
import Footer from '../Footer';
import Header from '../Header';

/**
 * About page with a description of Stargate
 * 
 * @returns About 
 */
function About() {

    return(
        <div>
            <Header />
            <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    minHeight:'calc(100vh - 362px)', 
                    maxWidth: '90vw', 
                    marginBottom:'20pt'
                }}>
                <div style={{paddingLeft: 50, paddingRight: 50, paddingTop: 25, paddingBottom: 25}} >
                    <Card id='card'>
                        <CardContent>
                            <h2 id='header2'>About Us</h2>
                            <p> Stargate is an e-commerce website that focuses on the sale of computer parts and associated products. It aims to create an accessible forefront into PC culture and make the cutting edge of technology less daunting for individuals of all technical skill levels, especially beginners and new customers who want to enter into the worlds of PC gaming, video editing, or other hobbies requiring more dedicated systems. We aim to achieve this by taking an altruistic approach to front-end web-based programming, presenting an all-inclusive, accessible web storefront, and implementing a dedicated recommender system for whole PC building, individual parts, and accessories. </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default About;