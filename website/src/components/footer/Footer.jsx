import React from 'react';

import './footer.scss';

import { Link } from 'react-router-dom';

import bg from '../../assets/footer-bg.jpg';
import logo from '../../assets/redis.png';

const Footer = () => {
    return (
        <div className="footer" style={{backgroundImage: `url(${bg})`}}>
            <div className="footer__content container">
                <div className="footer__content__logo">
                    <div className="logo">
                        <img src={logo} alt="" />
                        <Link to="/">RedisMovies</Link>
                    </div>
                </div>
                <div className="footer__content__menus">
                    <div className="footer__content__menu">
                        <Link to="/">Home</Link>
                        <a  href="https://github.com/redis-projects/" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <Link to="/">How to use this demo!</Link>
                        <Link to="/">About this demo!</Link>
                    </div>
                    <div className="footer__content__menu">
                        <a href="https://redis.io/docs/stack/" target="_blank" rel="noopener noreferrer">Redis Stack</a>
                        <a href="https://redis.io/docs/stack/json/" target="_blank" rel="noopener noreferrer">Redis JSON</a>
                        <a href="https://redis.io/docs/stack/search/" target="_blank" rel="noopener noreferrer">Redis Search</a>
                        <a href="https://redis.com/" target="_blank" rel="noopener noreferrer">Redis Enterprise</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
