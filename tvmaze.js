"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)
  console.log('got', res.data)
  return res.data;

}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let showImage = () => {
      if (show.show.image !== null) {
        return show.show.image.medium;
      }
      return 'https://tinyurl.com/tv-missing'
    }
    const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
           src='${showImage()}' 
              alt='${show.show.name}'
            class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    
    $showsList.append($show); 


   
}
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  console.log('term', term)
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
  $showsList.on('click', async function(e){
    e.preventDefault();
   
    if (e.target.tagName === 'BUTTON' ) {
      $episodesArea.empty();
      console.log('e', e.target.parentNode.parentNode.parentNode.dataset.showId);
      let showId = e.target.parentNode.parentNode.parentNode.dataset.showId
      let episodes = await getEpisodesOfShow(showId);
      populateEpisodes(episodes);
      console.log('ea', $episodesArea)
      console.log($episodesArea.css('display'));
      if ($episodesArea.css('display') === 'block') {
        $episodesArea.css({display: 'none'})
    }
    else if ($episodesArea.css('display') === 'none') {
      $episodesArea.css({display: 'block'})
    }
      }
    })
}
  

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let episodesRes = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  return episodesRes.data
 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  // VALIDATION FOR IMGS //
  for (let i=0;i<episodes.length;i++) {
    let epiImage = () => {
      if (episodes[i].image !== null) {
        return episodes[i].image.medium;
      }
      return 'https://tinyurl.com/tv-missing'
    }
// create DOM ele using JQUERY, data-episode-id accessible for future use
    const $episode = $(
        `<div data-episode-id="${episodes[i].id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
           src='${epiImage()}' 
              alt='${episodes[i].name}'
            class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${episodes[i].name}</h5>
             <div><small>${episodes[i].summary}</small></div>
           </div>
         </div>  
       </div>
      `);

    $episodesArea.append($episode); }
}

