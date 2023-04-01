import axios from 'axios';

async function getPhotos(newInput, pageNumber) {
    const API_URL = 'https://pixabay.com/api/';
  
    const options = {
      params: {
        key: '34896738-a1699c1dbaaca5ea67d26887d',
        q: newInput,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: pageNumber,
        per_page: 40,
      },
    };
  
    try {
      const response = await axios.get(API_URL, options);
  
      notification(response.data.hits.length, response.data.total);
  
      createMarkup(response.data);
    } catch (error) {
      console.log(error);
    }
  }