import './styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios');

const form = document.querySelector('.search-form');
const targepForAddingContent = document.querySelector('.gallery');

form.addEventListener('submit', event => {
    event.preventDefault();
    targepForAddingContent.innerHTML = '';
    const request = event.target[0].value;
    if (request) {
        getter(1, request)
            .then(response => {
                render(response)
                new SimpleLightbox('.gallery a');
            });
    };
    form.reset();
})


function getter(numberOfPage, request) {
    return axios.get('https://pixabay.com/api', {
        params: {
            key: '29321884-a1107c4d69cb5633d7e5f5c25',
            q: `${request}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 16,
            page: numberOfPage
        }
    })
    .then(response => response.data.hits)
    .catch(error => console.log(error));
};

function render(response) {
    console.log(response);
    targepForAddingContent.innerHTML = 
    response.reduce((acc, {largeImageURL, webformatURL, likes, views, comments, downloads}) => {
        return acc + `<div class="photo-card">
                        <a href="${largeImageURL}">
                            <img class="img" src="${webformatURL}" alt="" loading="lazy" />
                        </a>
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>
                                <span>${likes}</span>
                            </p>
                            <p class="info-item">
                                <b>Views</b>
                                <span>${views}</span>
                            </p>
                            <p class="info-item">
                              <b>Comments</b>
                              <span>${comments}</span>
                            </p>
                            <p class="info-item">
                              <b>Downloads</b>
                              <span>${downloads}</span>
                            </p>
                        </div>
                    </div>`
    }, '')
};

