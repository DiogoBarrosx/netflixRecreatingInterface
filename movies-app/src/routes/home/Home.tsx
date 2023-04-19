import { useState, useEffect } from 'react';
import CardMovie from '../../components/card/CardMovie';
import CoverMovie from '../../components/cover/CoverMovies';
import { Genre, moviesByGenreObject} from '../../types/Interfaces';
import { getGenres, getMoviesByGenre, getCover} from '../../services/Api';
import "./Home.css"
import { Link } from 'react-router-dom';


const Home = () => {

    const [cover, setCover] = useState<any>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [moviesByGenre, setMoviesByGenre] = useState<moviesByGenreObject>({});


    useEffect(() => {

        const loadCover = async () => {
            const cover = await getCover();
            setCover(cover);
        }

        const loadGenres = async () => {
          const genres = await getGenres();
          setGenres(genres);
    
          const moviesByGenre = await Promise.all(
            genres.map(async (genre) => {
              const movies = await getMoviesByGenre(genre.id);
              return {
                genreId: genre.id,
                movies,
              };
            })
          );
    

          const moviesByGenreObject = moviesByGenre.reduce<moviesByGenreObject>(
            (acc, { genreId, movies }) => {
              return {
                ...acc,
                [genreId]: movies,
              };
            },
            {}
          );
    
          setMoviesByGenre(moviesByGenreObject);
        };
    
        loadCover();
        loadGenres();
      }, []);


      return (
        <div className='container'>

          <div className='container-cover'>
                {cover?.map((movie:any) => <CoverMovie key={movie.id} movie={movie}/>)}
          </div>

          <div className="container-movie">
            
            {genres.map((genre) =>
              moviesByGenre[genre.id] ? (
                <div className='container-genres' key={genre.id}>
                  
                  <div className='genre-title'>
                      {<Link to={`/genre/${genre.id}`}>
                          <h2>{genre.name}</h2>
                      </Link>}
                  </div>

                  <div className="container-movie-genre">
                    
                        {moviesByGenre[genre.id]?.map((movie) => (
                            <CardMovie key={movie.id} movie={movie} />
                        ))}

                  </div>

                </div>
              ) : (
                
                <div key={genre.id} className="loading">
                  Loading {genre.name} movies...
                </div>

              )
            )}

          </div>
        </div>
      );
}


export default Home;