// OMDB API KEY
API_KEY = '8f43526'
// OMDB API
SEARCH_URL = `https://www.omdbapi.com/?`
// IMDB API
MOST_POPULAR_MOVIES = `https://imdb-api.com/en/API/MostPopularMovies/k_iij850vp`


const searchBar = document.querySelector('.searchBar')
const searchResultsContainer = document.querySelector('.searchResults')
const favMovieContainer = document.querySelector('.favMovieContainer')
const favMovieIds = []
let currentIds = JSON.parse(localStorage.getItem('favMovieIds'));
let uniqueIds = [...new Set(currentIds)]

async function searchMovies(searchQuery) {
    try {
        const response = await fetch(`${SEARCH_URL}apikey=${API_KEY}&s=${searchQuery}`)
        const data = await response.json()
        const { Search } = data
        console.log(Search)
        if (Search !== undefined && searchQuery.length >= 3) {
            let searchResults = Search.map(({ Poster, Title, Year, imdbID, Type }) => {
                return `<div class="card">
                <img class="imageBtn" id="${imdbID}" src="${Poster == 'N/A' ? 'placeholder.jpg' : Poster}" alt="image" />
                <div class="content">
                  <p class="textNormal">${Title}</p>
                  <p class="textNormal small">${Year}, ${Type}</p>
                  <button id="${imdbID}" class="btn addToFav">Add to Fav</button>
                </div>
              </div>`
            })

            let htmlData = ''
            searchResults.forEach(result => {
                htmlData += result
            })

            searchResultsContainer.innerHTML = htmlData

            // Add to fav
            document.querySelectorAll('.addToFav').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    addToFav(favMovieIds, e.target.id)
                    e.target.innerHTML = 'Added'
                })
            })

            // Single Movie Click Handler
            document.querySelectorAll('.imageBtn').forEach((result) => {
                result.addEventListener('click', (e) => {
                    localStorage.setItem('singleMovieId', JSON.stringify(e.target.id))
                    window.location.assign('/single-movie.html')
                })
            })

            // document.querySelectorAll('.addToFav').forEach((btn) => {
            //     btn.addEventListener('click', (e) => {
            //         console.log('Fav Button Clicked: ' + e.target.id)
            //         if (favMovieIds.includes(e.target.id)) {
            //             alert('Already Added to favorites')
            //             return
            //         }
            //         favMovieIds.push(e.target.id)
            //         if (currentIds != null) {
            //             localStorage.setItem('favMovieIds', JSON.stringify(JSON.parse(currentIds).concat(favMovieIds)))
            //         } else {
            //             localStorage.setItem('favMovieIds', JSON.stringify(favMovieIds))
            //         }
            //     })
            // })


        } else {
            searchResultsContainer.innerHTML = ''
        }


    } catch (error) {
        throw error
    }
}

// Add to Fav

function addToFav(favMovieIdArr, movieID) {
    favMovieIdArr.push(movieID)
    if (favMovieIdArr.length > 0) {
        let prevData = localStorage.getItem('favMovieIds');
        localStorage.setItem('favMovieIds', JSON.stringify(JSON.parse(prevData).concat(favMovieIdArr)))
    } else {
        localStorage.setItem('favMovieIds', JSON.stringify(favMovieIdArr))
    }
}

// Getting single movie

async function getSingleMovie(movieId) {
    try {
        const response = await fetch(`${SEARCH_URL}apikey=${API_KEY}&i=${movieId}`)
        const data = await response.json()
        const { Title, Year, Actors, Poster, Genre, Director, Writer, imdbRating, Plot, imdbID } = data

        let singleMovieHtmlData = `<h2 class="header">${Title}</h2>
        <p class="textNormal bold small my1">${Year}, ${Actors}</p>
        <div class="singleMovieContainer">
          <img src="${Poster}" alt="image" />
          <div class="singleMovieContent">
            <h2 class="header">${Title}</h2>
            <p class="textNormal bold">${Genre}</p>
            <p class="textNormal bold my1"><b>Directed by-</b> ${Director}</p>
            <p class="textNormal bold mb1"><b>Written by-</b> ${Writer}</p>
            <p class="textNormal bold mb1 rating">⭐${imdbRating} / 10</p>
            <p class="textNormal">
              <b>Plot: </b>${Plot}</p>
            <button id="${imdbID}" class="btn addToFav">Add to Fav</button>
          </div>
        </div>`

        document.querySelector('.singleMovie').innerHTML = singleMovieHtmlData
        document.querySelector('.singleMovieContent button').addEventListener('click', (e) => {
            addToFav(favMovieIds, e.target.id)
            e.target.innerHTML = 'Added'
        })
    } catch (error) {
        throw error
    }
}

let singleMovieId = JSON.parse(localStorage.getItem('singleMovieId'))
console.log(singleMovieId)
getSingleMovie(singleMovieId)

// Getting all favorite movies

function getFavMovies(favMovieIds) {
    if (favMovieIds) {
        favMovieIds.forEach(async (id) => {
            try {
                const response = await fetch(`${SEARCH_URL}apikey=${API_KEY}&i=${id}`)
                const data = await response.json()
                const { Title, Poster, Year, imdbID } = data

                let favMovieHtmlData = `<div class="favMovieCard">
                <img src="${Poster === 'N/A' ? 'placeholder.jpg' : Poster}" alt="image" />
                <div class="favMovieContent">
                  <div class="favLeft">
                    <p class="textNormal">${Title}</p>
                    <p class="textNormal small">${Year}</p>
                  </div>
                  <div class="favRight">
                    <button id="${imdbID}" class="btn addToFav remove">Remove</button>
                  </div>
                </div>
              </div>`

                if (favMovieContainer) {
                    favMovieContainer.insertAdjacentHTML('afterbegin', favMovieHtmlData)
                    document.querySelectorAll('.favRight button').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            removeFavMovie(uniqueIds, e.target.id)
                            window.location.reload()
                        })
                    })
                }

            } catch (error) {
                throw error
            }
        })
    }
}

getFavMovies(uniqueIds)

function removeFavMovie(totalIds, idToDel) {
    let resutls = totalIds.filter(id => id != idToDel)
    localStorage.setItem('favMovieIds', JSON.stringify(resutls))
    return resutls
}


if (searchBar) {
    searchBar.addEventListener('keyup', (e) => {
        searchMovies(e.target.value)
    });
}


