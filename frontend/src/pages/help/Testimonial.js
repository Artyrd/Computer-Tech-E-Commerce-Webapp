import { Card, CardContent } from '@mui/material';
import React from 'react';
import Footer from '../Footer';
import Header from '../Header';

/**
 * Testimonials page about how good Stargate is
 *  
 * @returns Testimonials
 */
function Testimonials() {

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
                            <h2 id='header2'>Testimonials!</h2>
                            <p> Song said "Looking good guys!" :) Thanks Song </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Testimonials;