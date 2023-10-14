import React, { Component } from 'react';
import { Toaster } from 'react-hot-toast';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getSearch } from 'api/getSearch';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { Modal } from './Modal/Modal';

export class App extends Component {
  state = {
    search: '',
    images: [],
    page: 1,
    total: 1,
    loading: false,
    error: null,
    empty: false,
    showModal: false,
    largeImageURL: '',
    alt: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { search, page } = this.state;
    if (prevState.search !== search || prevState.page !== page) {
      this.getRequest(search, page);
    }
  }

  getRequest = (text, page) => {
    this.setState({ loading: true });

    getSearch(text, page)
      .then(resp => resp.json())
      .then(data => {
        if (data.hits.length === 0) {
          this.setState({ empty: true });
        }
        this.setState(prevState => ({
          page: prevState.page,
          images: [...prevState.images, ...data.hits],
          total: data.total,
        }));
      })
      .catch(error => {
        this.setState({ error: error.message });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  clickLoad = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  handleSubmit = search => {
    this.setState({
      search,
      images: [],
      page: 1,
      total: 1,
      loading: false,
      error: null,
      empty: false,
    });
  };

  toggleModal = (largeImageURL, alt) => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      largeImageURL,
      alt,
    }));
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const {
      error,
      loading,
      images,
      total,
      page,
      showModal,
      largeImageURL,
      alt,
      empty,
    } = this.state;
    return (
      <div>
        <Toaster toastOptions={{ duration: 1500 }} />
        <Searchbar handleSubmit={this.handleSubmit} />
        {error && (
          <h2 style={{ textAlign: 'center' }}>
            Something went wrong: ({error})!
          </h2>
        )}
        <ImageGallery toggleModal={this.toggleModal} images={images} />
        {loading && <Loader />}
        {empty && (
          <h2 style={{ textAlign: 'center' }}>
            Sorry. There are no images ...
          </h2>
        )}
        {total / 12 > page && <Button clickLoad={this.clickLoad} />}
        {showModal && (
          <Modal closeModal={this.closeModal}>
            <img src={largeImageURL} alt={alt} />
          </Modal>
        )}
      </div>
    );
  }
}
