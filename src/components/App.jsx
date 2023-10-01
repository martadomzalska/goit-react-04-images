import { useState, useEffect } from 'react';
import { fetchImages } from 'services/api';
import { Blocks } from 'react-loader-spinner';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { LoadMoreButton } from './Button/Button';

export const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [totalHits, setTotalHits] = useState(null);
  const [modal, setModal] = useState({ isModalOpen: false, modalURL: '' });

  useEffect(() => {
    const handleKeyPress = e => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const searchbarValue = e.currentTarget.elements.searchbar.value;
    setCurrentPage(1);
    setImages([]);
    setCurrentQuery(searchbarValue);
    await handleFetchImages(searchbarValue, 1);
    setIsLoading(false);
  };

  const handleFetchImages = async (q, page) => {
    try {
      setIsLoading(true);
      const data = await fetchImages(q, page);
      setTotalHits(data.totalHits);
      setImages(prevImages => [...prevImages, ...data.hits]);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const fetchMoreImages = () => {
    handleFetchImages(currentQuery, currentPage + 1);
    setCurrentPage(currentPage + 1);
    setIsLoading(false);
  };

  const openModal = e => {
    if (e.target.nodeName !== 'IMG') {
      return;
    }
    const srcset = e.target.srcset;
    setModal({ isModalOpen: true, modalURL: srcset });
  };

  const closeModal = () => {
    setModal({ isModalOpen: false, modalURL: '' });
  };

  return (
    <div>
      <Searchbar onSubmit={handleSubmit}></Searchbar>
      {!isLoading ? (
        <ImageGallery loadedPhotos={images} onClick={openModal}></ImageGallery>
      ) : (
        <div className="container">
          <Blocks />
        </div>
      )}
      {totalHits === 0 && (
        <p>
          We're sorry, the pictures you are looking for were not found :( Try
          searching for something else!
        </p>
      )}
      <LoadMoreButton
        showButton={images.length > 0 && images.length < totalHits}
        onClick={fetchMoreImages}
      ></LoadMoreButton>
      <Modal
        show={modal.isModalOpen}
        imageUrl={modal.modalURL}
        onClose={closeModal}
      ></Modal>
    </div>
  );
};
