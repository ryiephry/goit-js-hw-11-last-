// Import necessary libraries/modules
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Select DOM elements
const formEl = document.querySelector('.search-form'); // Selects the search form element
const gallery = document.querySelector('.gallery'); // Selects the gallery container element
const loadMoreEl = document.querySelector('.load-more'); // Selects the "Load More" button element
const inputEl = document.querySelector('[name=searchQuery]'); // Selects the search input element


let userInput = '';
let page = 1;
let totalImages = page * 40;

formEl.addEventListener('submit', handleFormSubmit);
loadMoreEl.addEventListener('click', onLoadMore);

// Hide "Load More" button initially
loadMoreEl.classList.add('load-more');

btnIsHidden();

// Function to handle form submission
async function handleFormSubmit(e) {
  e.preventDefault(); // Prevent default form submission behavior

  clearImagesMarkup();

  // Get and trim user input
  userInput = inputEl.value.trim();

  if (userInput === '') {
    btnIsHidden(); // Hide "Load More" button
    return;
  }

  // Reset page and totalImages for new search
  page = 1;
  totalImages = page * 40;

  try {
    // Fetch data from API using user input and page number
    const data = await fetchData(userInput, page);

    if (data.hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnIsHidden(); // Hide "Load More" button
      return;
    }

    createMarkup(data.hits);

    // Check if the total number of fetched images is less than 40
    if (data.hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      btnIsHidden(); // Hide "Load More" button
    } else {
      btnIsOpen(); // Show "Load More" button
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    btnIsHidden(); // Hide "Load More" button
  }

  inputEl.value = ''; // Clear input field
}

// Function to handle "Load More" button click
async function onLoadMore() {
  page += 1; // Increment page number
  console.log(page)
  try {
    // Fetch more data from API using user input and updated page number
    const data = await fetchData(userInput, page);

    if (data.hits.length === 0) {
      Notify.info("We're sorry, but there are no more images.");
      btnIsHidden(); // Hide "Load More" button
      return;
    }

    createMarkup(data.hits);

    // Check if the total number of fetched images is less than 40
    if (data.hits.length < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      btnIsHidden(); // Hide "Load More" button
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    btnIsHidden(); // Hide "Load More" button
  }
}

// Function to fetch data from the Pixabay API
async function fetchData(userInput, page) {
  try {
    // Make an HTTP GET request using Axios to the Pixabay API
    const response = await axios.get(
      `https://pixabay.com/api/?key=38245803-17b2e774beea3b422758604fe&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return response.data; // Return the fetched data
  } catch (error) {
    throw error; // Throw the error if API request fails
  }
}

// Function to create markup for images
function createMarkup(hits) {
  for (let i = 0; i < hits.length; i++) {
    // Create a new div element for each image
    let divEl = document.createElement('div');
    divEl.className = 'photo-card'; // Set class name
    divEl.innerHTML = `<img src="${hits[i].webformatURL}" alt="${hits[i].tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                <b>Likes</b>
                <br>
                ${hits[i].likes}
                </p>
               <p class="info-item">
                <b>Views</b>
                 ${hits[i].views}
                </p>
                <p class="info-item">
                <b>Comments</b>
                <br>
                ${hits[i].comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>
                <br>
                ${hits[i].downloads}
                </p>
            </div>`;
    gallery.append(divEl); // Append the created element to the gallery
  }

  loadMoreEl.classList.add('load-more-unhidden'); // Show button
}

function clearImagesMarkup() {
  gallery.innerHTML = ''; // Clear the content of the gallery element
}

// Function to hide "Load More" button
function btnIsHidden() {
  loadMoreEl.classList.add('load-more'); // Add "load-more" class to hide the button
}

// Function to show "Load More" button
function btnIsOpen() {
  loadMoreEl.classList.remove('load-more'); // Remove "load-more" class to show the button
}

