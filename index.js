const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const moviesContainer = document.getElementById("movie-container")
const watchListPage = document.getElementById("watchlist-page")
let addMovie = localStorage.getItem('addMovie')
let watchlist = addMovie ? JSON.parse(addMovie) : []
let html = ``


function movieFetch(){
    fetch(`https://www.omdbapi.com/?apikey=c30abc27&s=${searchInput.value}`)
    .then(Response => Response.json())
    .then(data => {
        if(data.Response === 'True'){
            moviesContainer.innerHTML = ''
            html = ``
            data.Search.map(movie => {
                fetch(`https://www.omdbapi.com/?apikey=c30abc27&t=${movie.Title}`)
                .then(Response => Response.json())
                .then(data => {
                    html += htmlReturned(data)
                    moviesContainer.innerHTML = html
                }
            )}
    )
        } else {
            moviesContainer.innerHTML =
            `<h2 class="error-msg">
                Unable to find what you’re looking for. Please try another search.
            </h2>`
            throw new Error(`Error status: ${data.Error}`)
        }}
    )
    .catch(Error => {
        console.error(Error)
        moviesContainer.innerHTML =
        `<h2 class="error-msg">
        Something went wrong.
        </h2>`
    })
}

function htmlReturned(data){
    let poster = data.Poster == "N/A" ? "No-image-available.png" : data.Poster
    const circleIcon = watchlist.includes(data.imdbID) ? 'fa-circle-minus' : 'fa-circle-plus'
    const watchlistOrRemove = watchListPage ? 'Remove' : 'Watchlist'

    return `<div class="movie-div">
    <img class="poster" src=${poster} />
    <div class="movie-div-details">
        <div class="title-div">
            <h2 class="movie-title">${data.Title}</h2>
            <i class="fa-solid fa-star"></i>
            <h5>${data.imdbRating}</h5>
        </div>
        <div class="runtime-div">
            <p>${data.Runtime}</p>
            <p>${data.Genre}</p>
            <span>
            <i class="fa-solid ${circleIcon}"></i>
            <button id="watchlist-btn" data-imdbid=${data.imdbID}>${watchlistOrRemove}</button>
            </span>
        </div>
        <div class="plot-div">
            <h4 class="plot-disc">${data.Plot}</h4>
        </div>
    </div>
</div>`
}

function renderWatchlistPage(){
    if(watchListPage){
        for(let movie of watchlist){
            fetch(`https://www.omdbapi.com/?apikey=c30abc27&i=${movie}`)
            .then(Response => Response.json())
            .then(data => {
                html= ``
                document.querySelector('.empty-watchList').style.display = 'none'
                watchListPage.innerHTML += htmlReturned(data)
            })
        }
    }
}

renderWatchlistPage()

// Click events

document.body.addEventListener('click', (e) => {
    if (watchlist.includes(e.target.dataset.imdbid) && e.target.dataset.imdbid){ // to remove the movie from watchlist
        let filtered = watchlist.filter(mov => e.target.dataset.imdbid !== mov)
        localStorage.setItem('addMovie', JSON.stringify(filtered))
        e.target.previousElementSibling.classList.remove('fa-circle-minus')
        e.target.previousElementSibling.classList.add('fa-circle-plus')
        if(location.href.includes('watchlist.html')){
            location.reload()
        }
    }
    if (!watchlist.includes(e.target.dataset.imdbid) && e.target.dataset.imdbid){ // to add imdb id of movie to watchlist
        e.target.previousElementSibling.classList.remove('fa-circle-plus')
        e.target.previousElementSibling.classList.add('fa-circle-minus')
        watchlist.push(e.target.dataset.imdbid)
        localStorage.setItem('addMovie', JSON.stringify(watchlist))
    }
})

if(location.href.includes('index.html')){
    searchBtn.addEventListener('click', movieFetch)
    searchInput.addEventListener('keypress', (e)=>{ //Triggering the search bar with Enter key
        if (e.key === "Enter") {
            e.preventDefault();
            searchBtn.click();
          }
    })
}