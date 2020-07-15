const Hapi = require('hapi'),
      fetch = require("node-fetch"),
      MovieModel=require('./model/movie'),
      mongoose = require('mongoose'),
      config=require('./config/dev')

const server=Hapi.server({
    host:'localhost',
    port:8000
  });

mongoose.connect(config.DB_URI);

//Add function for get data from omdbApi
const omdbMovie = async (imdbId, callback) => {
    let hostMovieData  = await fetch(`https://www.omdbapi.com/?apikey=7c1f340b&i=${imdbId}`)
    let hostMovieJson = await hostMovieData.json();
    return hostMovieJson;
}

//Add Route
server.route({
    method: 'GET',
    path: '/movies/{imdbID}',
    handler: async function (request, reply) {
        let imdbId = request.params.imdbID;
        try{
          const movieDetails = await MovieModel.findOne({imdbID: imdbId});
          if(movieDetails){
            return movieDetails;
          }
          else{
            let movieData =  await omdbMovie(imdbId)
            let data={
              Title:movieData['Title'] ,
              Year:movieData['Year'] ,
              Released:movieData['Released']  ,
              Genre:movieData['Genre']  ,
              Director:movieData['Director'] ,
              Awards:movieData['Awards']  ,
              imdbID:movieData['imdbID']  ,
              Type: movieData['Type'] ,
              Ratings: movieData['Ratings'] 
            }
            let movie = new MovieModel(data);
            let result = await movie.save();
            return (result);
          }
        }catch(error) {
          return reply.response(error).code(500);
        } 
    }
});

server.route({
  method:"GET",
  path:"/movies",
  handler: async (request, resp) => {
      try{
         let movies = await MovieModel.find().exec();
         return resp.response(movies);
      } catch(error) {
         return resp.response(error).code(500);
      }
  }
});

// Start the server
async function start() {
    try {
      await server.start();
    }
    catch (err) {
      console.log(err);
      process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
  };
  
start();