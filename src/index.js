import axios from 'axios';
const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');
const inputEl = document.querySelector('[name=searchQuery]');
let userInput = ''; // Global variable to store the userInput
let dataEl = ''
let page = 1;


// Add an event listener to the form to handle form submissions
formEl.addEventListener('submit', handleFormSubmit);

// Function to handle form submissions
async function handleFormSubmit(e) {
  e.preventDefault(); // Prevent the default form submission behavior
  

  // checks if the current value is equal to previous value ,  and  if the button thats being pressed isnt the load more button then it executes 
  if (inputEl.value !== userInput && e.target.className !== 'load-more-unhidden'   ) { 
    gallery.innerHTML = ""
    page = 1

    loadMoreEl.classList.remove("load-more-unhidden")//classList.remove('load-more-unhidden');
    loadMoreEl.classList.add("load-more")
  }
 
    
  // Get the user input from the first input element in the form and remove any leading/trailing white spaces
  if (e.target.className === 'load-more-unhidden') {
    userInput = userInput.trim(); // Use the stored userInput value
  } else {
    userInput = inputEl.value.trim();
  }

  // Fetch data from the API using the user input and the current page number
  const data = await fetchData(userInput, page);

  if (data.total === 0) {
    //if no images 
    alert('Sorry, no images found. Please try again.');
  } else {
    console.log(data.totalHits)
    createMarkup(data.hits);
  }
  let totalImages = page * 40;

      // if the page times the amount of images => totalHits , alerts screen 
  let dataEl = data.hits;

   if (data.hits < 40) { 
     console.log("less hits")
     
    //  loadMoreEl.classList.add("load-more");
     loadMoreEl.classList.remove("load-more-unhidden");
     loadMoreEl.classList.add("load-more");
   }
  
  
  if (totalImages === data.totalHits && totalImages > data.totalHits) {
    // if (data.totalHits <= data) { 
    console.log("more then");
    alert("We're sorry, but you've reached the end of search results.")
    // }

    loadMoreEl.classList.add("load-more");
   
  } else { 
    loadMoreEl.classList.remove("load-more")
  }
   

  // Reset the input value to an empty string after the form is submitted
  if (e.target.className !== 'load-more-unhidden') {
    inputEl.value = '';
  }
  page += 1;
}
// Rest of the code remains unchanged... // ..
// Function to fetch data from the Pixabay API based on user input and page number
async function fetchData(userInput, page) {
  try {
    // Make an HTTP GET request using Axios to the Pixabay API
    const response = await axios.get(
      `https://pixabay.com/api/?key=38245803-17b2e774beea3b422758604fe&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    // Return the data (hits array and other information) from the API response
    console.log(page);
    return response.data;
  } catch (error) {
    // If an error occurs during the API call, log the error message and throw the error
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Function to create markup
function createMarkup(hits) {
  for (let i = 0; i < hits.length; i++) {
    let divEl = document.createElement('div');
    divEl.className = 'photo-card';
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
    gallery.append(divEl);
  }
  
  if (dataEl > 40) {
    loadMoreEl.classList.remove('load-more');
  }
  loadMoreEl.classList.add('load-more-unhidden');
 
}

loadMoreEl.addEventListener("click", handleFormSubmit);
