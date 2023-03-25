const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")


searchBtn.addEventListener('click', ()=> {
    fetch(`http://www.omdbapi.com/?apikey=c30abc27&t=${searchInput.value}`)
        .then(Response => Response.json())
        .then(data => {
            console.log(data)
            document.getElementById("movie-container").innerHTML = `<h2>${data.Title}</h2>`
            
        }
    )
})