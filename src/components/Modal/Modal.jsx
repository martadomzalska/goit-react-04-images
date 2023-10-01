import css from './Modal.module.css';
import PropTypes from 'prop-types';

export const Modal = ({ show, imageUrl, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal}>
        <img src={imageUrl} alt="Modal" width="800" height="600" />
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};
