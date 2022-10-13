const playlistId = window.location.pathname.split('/')[2]
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const searchResult = document.querySelector('#search-result')

searchForm?.addEventListener('submit', event => {
  event.preventDefault()
  axios
    .get(`/search?playlistId=${playlistId}&q=${searchInput.value}`)
    .then(res => {
      searchResult.style.display = 'block'
      searchResult.innerHTML = ''

      res.data.forEach(data => {
        const item = document.createElement('div')
        item.className = 'd-flex my-1 border'
        item.innerHTML = `
          <input type="checkbox" id="${data.id}" name="track" value="${data.id}" class="form-check-input ms-1 mt-auto mb-auto">
          <label for="${data.id}" class="d-flex w-100">
            <div style="width: 10%; margin: auto 1%;">
              <img src="${data.albumImage}" style="width: 95%;">
            </div>
            <div style="width: 45%; margin: auto;">
              <p class="m-0">${data.name}</p>
              <p class="m-0 fw-light">${data.artist}</p>
            </div>
            <div style="width: 45%; margin: auto;">
              <p class="m-0">${data.album}</p>
            </div>
          </label> 
        `
        searchResult.appendChild(item)
      })
    })
})