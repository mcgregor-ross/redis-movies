import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Button, { OutlineButton } from "../button/Button";
import Modal, { ModalContent } from "../modal/Modal";

import tmdbApi, { category } from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";

import javaMovieService from "../../api/javaMovieService";

import "./hero-slide.scss";

const HeroSlide = () => {
    SwiperCore.use([Autoplay]);

    const [movieItems, setMovieItems] = useState([]);

    useEffect(() => {
        const getMovies = async () => {
            const params = { page: 0, size: 3 };
            try {
                const response = await javaMovieService.getSortedMovies("popularity", { params });
                setMovieItems(response.data.content.slice(0, 3));
            } catch {
                console.log("error");
            }
        };
        getMovies();
    }, []);

    return (
        <div className="hero-slide">
            <Swiper
                modules={[Autoplay]}
                grabCursor={true}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 10000 }}>
                {movieItems.map((item, i) => (
                    <SwiperSlide key={i}>
                        {({ isActive }) => <HeroSlideItem item={item} className={`${isActive ? "active" : ""}`} />}
                    </SwiperSlide>
                ))}
            </Swiper>
            {movieItems.map((item, i) => (
                <TrailerModal key={i} item={item} />
            ))}
        </div>
    );
};

const HeroSlideItem = (props) => {
    // let history = useNavigate();

    const item = props.item;

    const background = apiConfig.originalImage(item.backdrop_path ? item.backdrop_path : item.posterImage);

    const setModalActive = async () => {
        const modal = document.querySelector(`#modal_${item.id}`);

        let videos = await tmdbApi.getVideos(category.movie, item.id);

        if (videos.results.length > 0) {
            
            // Search for first instance of 'trailer'
            var video = videos.results.find(function(v) {
                return v.name.toLowerCase().includes("trailer");
            });

            // otherwise use the 1st vid 
            video = !video ? videos.results[0] : video;

            // get the YouTube embeded link
            const videSrc = "https://www.youtube.com/embed/" + video.key;

            // embed in an iFrame
            modal.querySelector(".modal__content > iframe").setAttribute("src", videSrc);
        } else {
            modal.querySelector(".modal__content").innerHTML = "No trailer";
        }

        modal.classList.toggle("active");
    };

    return (
        <div className={`hero-slide__item ${props.className}`} style={{ backgroundImage: `url(${background})` }}>
            <div className="hero-slide__item__content container">
                <div className="hero-slide__item__content__info">
                    <h2 className="title">{item.title}</h2>
                    <div className="overview">{item.overview}</div>
                    <div className="btns">
                        <Link to={"/movie/" + item.id} state={{ data: item }}>
                            {/* onClick={() => history.push("/movie/" + item.id)} */}
                            <Button>More Info</Button>
                        </Link>
                        <OutlineButton onClick={setModalActive}>Watch trailer</OutlineButton>
                    </div>
                </div>
                <div className="hero-slide__item__content__poster">
                    <img src={apiConfig.w500Image(item.posterImage)} alt="" />
                </div>
            </div>
        </div>
    );
};

const TrailerModal = (props) => {
    const item = props.item;

    const iframeRef = useRef(null);

    const onClose = () => iframeRef.current.setAttribute("src", "");

    return (
        <Modal active={false} id={`modal_${item.id}`}>
            <ModalContent onClose={onClose}>
                <iframe ref={iframeRef} width="100%" height="500px" title="trailer"></iframe>
            </ModalContent>
        </Modal>
    );
};

export default HeroSlide;
