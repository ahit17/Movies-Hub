import React, { useState,useEffect } from "react";
import "./MovieDetail.css";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAsyncMovieOrShowDetail,
  getSelectedMovieOrShow,
  removeSelectedMovieOrShow,
  fetchAsyncVideo
} from "../../features/movies/movieSlice";
import axios from "axios";
import YouTube from 'react-youtube';

const MovieDetail = () => {
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    }
  };
  const { imdbID } = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow);
  const mov= useSelector(fetchAsyncVideo);
  const rev=mov.id;
  const [videoId, setVideoId] = useState('');
  console.log(data);
  useEffect(() => {
    dispatch(fetchAsyncMovieOrShowDetail(imdbID));
    return () => {
      dispatch(removeSelectedMovieOrShow());
    };
  }, [dispatch, imdbID]);
  useEffect(() => {
    const fetchVideoId = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            q: `${data.Title} trailer`,
            part: 'snippet',
            maxResults: 1,
            type: 'video',
            key: 'AIzaSyA0mm9Nytj4K05OhX4ihIvfjQNIPbNOXSo', // Replace with your YouTube Data API key
          },
        });

        if (response.data.items.length > 0) {
          const { videoId } = response.data.items[0].id;
          setVideoId(videoId);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideoId();
  },[data.Title]);
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };
 const  Ready=(event) =>{
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };
  const RenderedComponent = () => {
    console.log(mov);
    return (
      <div>
       <YouTube videoId={videoId}  opts={opts} onReady={Ready} />
      </div>
    );
  };
  return (
    <div className="movie-section">
      {Object.keys(data).length === 0 ? (
        <div>...Loading</div>
      ) : (
        <>
          <div className="section-left">
            <div className="movie-title">{data.Title}</div>
            <div className="movie-rating">
              <span>
                IMDB Rating <i className="fa fa-star"></i> : {data.imdbRating}
              </span>
              <span>
                IMDB Votes <i className="fa fa-thumbs-up"></i> :{" "}
                {data.imdbVotes}
              </span>
              <span>
                Runtime <i className="fa fa-film"></i> : {data.Runtime}
              </span>
              <span>
                Year <i className="fa fa-calendar"></i> : {data.Year}
              </span>
            </div>
            <div className="movie-plot">{data.Plot}</div>
            <div className="movie-info">
              <div>
                <span>Director</span>
                <span>{data.Director}</span>
              </div>
              <div>
                <span>Stars</span>
                <span>{data.Actors}</span>
              </div>
              <div>
                <span>Generes</span>
                <span>{data.Genre}</span>
              </div>
              <div>
                <span>Languages</span>
                <span>{data.Language}</span>
              </div>
              <div>
                <span>Awards</span>
                <span>{data.Awards}</span>
              </div>
              <div>
                <button onClick={handleClick}className="trailer" >Play Trailer</button>
                {isVisible && <RenderedComponent />}
              </div>
            </div>
          </div>
          <div className="section-right">
            <img src={data.Poster} alt={data.Title} />
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetail;
