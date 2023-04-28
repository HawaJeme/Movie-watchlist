const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const moviesContainer = document.getElementById("movie-container")
const watchListPage = document.getElementById("watchlist-page")
let addMovie = localStorage.getItem('addMovie')
let watchlist = addMovie ? JSON.parse(addMovie) : []

function movieFetch(){
    fetch(`http://www.omdbapi.com/?apikey=c30abc27&s=${searchInput.value}`)
    .then(Response => Response.json())
    .then(data => {
        if(data.Response === 'True'){
            moviesContainer.innerHTML = ''
            html = ``
            data.Search.map(movie => {
                fetch(`http://www.omdbapi.com/?apikey=c30abc27&t=${movie.Title}`)
                .then(Response => Response.json())
                .then(data => {
                    movieDivs(data)
                    moviesContainer.innerHTML = html
                }
            )}
    )
        } else {
            moviesContainer.innerHTML = `<h2 class="error-msg">Unable to find what you’re looking for. Please try another search.</h2>`
            console.log(data.Response)
            throw new Error(`Error status: ${data.Error}`)
        }}
    )
    .catch(Error => {
        console.error(Error)
    })
}

let html = ``
function movieDivs(data){
    let poster = data.Poster == "N/A" ? "No-image-available.png" : data.Poster
    // const circleIcon = watchlist.filter(mov => data.imdbID === mov) ? 'fa-circle-minus' : 'fa-circle-plus'
    html += `<div class="movie-div">
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
                    <i class="fa-solid fa-circle-plus"></i>
                    <button id="watchlist-btn" data-add=${data.imdbID}>Watchlist</button>
                    </span>
                </div>
                <div class="plot-div">
                    <h4 class="plot-disc">${data.Plot}</h4>
                </div>
            </div>
        </div>`
    return html
}
if(watchListPage){
    for(let movie of watchlist){
        fetch(`http://www.omdbapi.com/?apikey=c30abc27&i=${movie}`)
        .then(Response => Response.json())
        .then(data => {
            html= ``
            console.log(watchlist)
            movieDivs(data)
            document.querySelector('.empty-watchList').style.display = 'none'
            watchListPage.innerHTML += html
        })
    }
}
document.body.addEventListener('click', (e) => {
    if (e.target.dataset.add && !watchlist.includes(e.target.dataset.add)){
        e.preventDefault()
        console.log(e.target.dataset.add)
        watchlist.push(e.target.dataset.add)
        console.log(watchlist)
        localStorage.setItem('addMovie', JSON.stringify(watchlist))
    }
})
document.getElementById("watchlist-btn").addEventListener('toggle', ()=> {
    console.log('add')
    console.log('remove')
})
if(searchBtn){
    searchBtn.addEventListener('click', movieFetch)
}