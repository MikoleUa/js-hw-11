import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GalleryApi from './api.js';

const galleryRef = document.querySelector('.gallery');
const inputSearch = document.querySelector('.search-form');
const btnloadMore = document.querySelector('.load-more');

const newGalleryApi = new GalleryApi(40);
const simplelightboxGallery = new SimpleLightbox('.gallery a');

inputSearch.addEventListener('submit', onSubmitSearch);
btnloadMore.addEventListener('click', onBtnloadMoreClick);

function onBtnloadMoreClick(e) {
  e.preventDefault();

  newGalleryApi.increment();
  newGalleryApi.fetchGallery().then(res => {
    if (res.total < newGalleryApi.page * newGalleryApi.perPage) {
      btnloadMore.style.visibility = 'hidden';
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
    renderGallery(res);
    refrechOpenModal(simplelightboxGallery);
  });
}
function onSubmitSearch(e) {
  e.preventDefault();

  const { searchQuery } = e.currentTarget.elements;
  if (searchQuery.value === '') {
    return Notify.failure('Please, search something');
  }
  newGalleryApi.searchWord = searchQuery.value;
  galleryRef.innerHTML = '';
  newGalleryApi.reset();

  newGalleryApi.fetchGallery().then(res => {
    if (res.hits.length === 0) {
      return Notify.warning('Please, try again');
    }
    Notify.success(`Hooray! We found ${res.totalHits} images.`);
    renderGallery(res);
    refrechOpenModal(simplelightboxGallery);
  });
  btnloadMore.style.visibility = 'visible';
}
function createGallery(data) {
  return data.hits
    .map(
      data => `<div class="photo-card">
      <a id='largeImg' href= ${data.largeImageURL}>
  <img src=${data.webformatURL} loading="lazy"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span> ${data.likes}</span> 
    </p>
    <p class="info-item">
      <b>Views</b><span>${data.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${data.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${data.downloads}</span>
    </p>
  </div>

</div>`
    )
    .join('');
}
function renderGallery(data) {
  galleryRef.insertAdjacentHTML('beforeend', createGallery(data));
}
function refrechOpenModal(obj) {
  obj.refresh().on('show.simplelightbox');
}
