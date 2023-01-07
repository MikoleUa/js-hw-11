export default class GalleryApi {
  constructor(perPage = 10) {
    this.searchWord = '';
    this.page = 1;
    this.perPage = perPage;
  }

  async fetchGallery() {
    const fetchUrl = `https://pixabay.com/api/?q=${this.searchWord}&page=${this.page}&key=23293955-a7595990e0e78e906d7de269f&image_type=photo&orientation=horizontal&per_page=${this.perPage}`;
    try {
      const res = await fetch(fetchUrl);
      const response = await res.json();

      return response;
    } catch (error) {
      return alert(error);
    }
  }
  increment() {
    this.page += 1;
  }
  reset() {
    this.page = 1;
  }
}
