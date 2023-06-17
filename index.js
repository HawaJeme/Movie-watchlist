const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const moviesContainer = document.getElementById("movie-container")
const watchListPage = document.getElementById("watchlist-page")
const emptyWatchlist = document.querySelector(".empty-watchList")
const spinner = document.querySelector(".spinner")
let addMovie = localStorage.getItem("addMovie")
let watchlist = addMovie ? JSON.parse(addMovie) : []
let html
let loading = false

async function movieFetch(){
    const res = await fetch(`https://www.omdbapi.com/?apikey=c30abc27&s=${searchInput.value}`)
    const data = await res.json()

    try {
        if(data.Response === "True"){
            loading = true
            spinner.style.display = "block"
            moviesContainer.innerHTML = ``
            html = ``
            data.Search.map( async movie => {
                const res = await fetch(`https://www.omdbapi.com/?apikey=c30abc27&t=${movie.Title}`)
                const data = await res.json()
                html += moviesHTML(data)
                loading = false
                spinner.style.display = "none"
                moviesContainer.innerHTML = html
            })
        } else {
            throw new Error(data.Error)
        }
    }
    
    catch (Error) {
        console.error(Error)
        moviesContainer.innerHTML =
        `<h2 class="error-msg">
            Unable to find what you're looking for. Please try again.
        </h2>`
    }
}

function moviesHTML(data){
    const {Poster, imdbID, Title, imdbRating, Runtime, Genre, Plot} = data

    let posterImg = Poster == "N/A" ? "images/No-image-available.png" : Poster
    const circleIcon = watchlist.includes(imdbID) ? "fa-circle-minus" : "fa-circle-plus"
    const watchlistOrRemove = watchListPage ? "Remove" : "Watchlist"
    let plot = ``
    if(Plot.length < 145){
        plot = [...Plot].join('')
    } else {
        for(let i=0; i< 145; i++){
            plot += Plot[i]
        }
        plot += `   read more...`
    }

    return (
        `<div class="movie-div">
            <img class="poster" src=${posterImg} />
            <div class="movie-div-details">
                <div class="title-div">
                    <h2 class="movie-title">${Title}</h2>
                    <span>
                        <i class="fa-solid fa-star"></i>
                        <h5 class="rating">${imdbRating}</h5>
                    </span>
                </div>
                <div class="runtime-div">
                    <p>${Runtime}</p>
                    <p>${Genre}</p>
                    <span>
                        <i class="fa-solid ${circleIcon}"></i>
                        <button id="watchlist-btn" data-imdbid=${imdbID}>${watchlistOrRemove}</button>
                    </span>
                </div>
                <div class="plot-div">
                    <h4 class="plot-disc">${plot}</h4>
                </div>
            </div>
        </div>
        `
    )
}

async function renderWatchlistPage(){
    if(emptyWatchlist){
        for(let movie of watchlist){
            loading = true
            spinner.style.display = "block"
            const res = await fetch(`https://www.omdbapi.com/?apikey=c30abc27&i=${movie}`)
            const data = await res.json()
            emptyWatchlist.style.display = "none"
            loading = false
            spinner.style.display = "none"
            watchListPage.innerHTML += moviesHTML(data)
        }
    }
}

renderWatchlistPage()

function addRemoveMovie(e){
    const imdbID = e.target.dataset.imdbid
    const icon = e.target.previousElementSibling

    // to remove the movie from watchlist
    if (watchlist.includes(imdbID) && imdbID){ 
        icon.classList.remove('fa-circle-minus')
        icon.classList.add('fa-circle-plus')

        let filtered = watchlist.filter(movie => imdbID !== movie)
        localStorage.setItem('addMovie', JSON.stringify(filtered))
        location.href.includes('watchlist.html') && location.reload()
    }

    // to add imdb id of movie to watchlist
    if (!watchlist.includes(imdbID) && imdbID){ 
        icon.classList.remove('fa-circle-plus')
        icon.classList.add('fa-circle-minus')

        watchlist.push(imdbID)
        localStorage.setItem('addMovie', JSON.stringify(watchlist))
    }
}

// Event listeners

document.body.addEventListener('click', (e) => addRemoveMovie(e))
searchBtn?.addEventListener('click', movieFetch)

// Triggering the search bar with Enter key
searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        searchBtn.click()
    }
})
