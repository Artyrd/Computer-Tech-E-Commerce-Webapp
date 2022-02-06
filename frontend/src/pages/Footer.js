import React from "react";
import styled from 'styled-components';
import { Link } from "react-router-dom";

const Box = styled.div`
    padding: 15px 15px;
    background: #062241;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	max-width: 1000px;
	margin: 0 auto;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
`;

const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(3,
                            minmax(185px, 1fr));
    grid-gap: 20px;
`;

const FooterLink = styled.a`
    color: #fff;
    margin-bottom: 20px;
    font-size: 14px;
    text-decoration: none;

    &:hover {
        color: #5C7FA1;
        transition: 200ms ease-in;
    }
`;

const Heading = styled.p`
    font-size: 24px;
    color: #fff;
    margin-bottom: 20px;
    font-weight: bold;
`;

/**
 * The footer of every page a customer can view, provides links to the 
 * following pages:
 *      - Who Are We?
 *      - Testimonials
 *      - Help
 *      - Recommender Survey
 *      - Order Help
 *      - Price Drop Form
 * 
 * @returns Footer
 */
const Footer = () => {
    return (
        <div>
            <Box>
                <Container>
                    <Row>
                        <Column>
                            <Heading>About Us</Heading>
                            <FooterLink href="/about">Who Are We?</FooterLink>
                            <FooterLink href="/testimonials">Testimonials</FooterLink>
                        </Column>
                        <Column>
                            <Heading>Contact Us</Heading>
                            <FooterLink href="/orderhelp">Help</FooterLink>
                        </Column>
                        <Column>
                            <Heading>Services</Heading>
                            <FooterLink href="/recommender">Recommender Survey</FooterLink>
                            <FooterLink href="/orderhelp">Order Help</FooterLink>
                            <FooterLink href="/pricedrop">Price Drop Form</FooterLink>
                        </Column>
                    </Row>
                </Container>
            </Box>
        </div>
    );
};
export default Footer;
