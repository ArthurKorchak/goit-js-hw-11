import './styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios');

axios.get('https://pixabay.com/api?key=28851303-896d813d757a6464ec79bc796&q=cat')


const form = document.querySelector('.search-form');
const targepForAddingContent = document.querySelector('.gallery');
const guard = document.querySelector('.guard')
const options = {
    root: null,
    rootMargin: '400px',
    treshold: 1
};
let page = 1;
let request;
let lightbox;
let isObserve = false;
const observer = new IntersectionObserver(updateList, options)

function updateList(data) {
    data.forEach(data => {
        if (data.isIntersecting) {
            page += 1;
            getter(page, request)
                .then(response => {
                    render(response.hits);
                    lightbox.refresh();
                });
        };
    });
};

form.addEventListener('submit', event => {
    event.preventDefault();
    targepForAddingContent.innerHTML = '';
    request = event.target[0].value;
    if (isObserve) {
        observer.unobserve(guard);
    };
    page = 1;
    if (request) {
        getter(page, request)
            .then(response => {
                if (response.hits.length) {
                    render(response.hits);
                    lightbox = new SimpleLightbox('.gallery a');
                    Notify.success(`Hooray! We found ${response.totalHits} images.`);
                    observer.observe(guard);
                    isObserve = true;
                } else {
                    Notify.failure('Sorry, your request not result.');
                };
            });
    } else {
        Notify.failure('Please, input something!');
    };
    form.reset();
});

async function getter(numberOfPage, request) {
    const answer = await axios.get('https://pixabay.com/api', {
        params: {
            key: '29321884-a1107c4d69cb5633d7e5f5c25',
            q: `${request}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 16,
            page: numberOfPage
        }
    });
    return answer.data;
};

function render(response) {
    const content = response.reduce((acc, {largeImageURL, webformatURL, likes, views, comments, downloads}) => {
        return acc + `<div class="photo-card">
                        <a href="${largeImageURL}">
                            <img class="img" src="${webformatURL}" height="400" loading="lazy"/>
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
    }, '');
    targepForAddingContent.insertAdjacentHTML('beforeend', content);
};