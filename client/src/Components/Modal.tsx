import React from 'react';
import ReactModal from 'react-modal';
import {createStyles, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      position: 'absolute',
      top: '32px',
      bottom: '32px',
      left: '73px',
      right: '73px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '32px',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1202,
      backgroundColor: 'rgba(0, 0, 0, .75)',
    },
  })
);

interface ModalProps {
  renderProp: React.ReactElement;
  closeModal: boolean;
}

export const Modal: React.FC<ModalProps> = props => {
  const classes = useStyles();

  return (
    <ReactModal
      className={classes.modal}
      isOpen
      appElement={document.getElementById('app')}
      onRequestClose={props.closeModal}
      overlayClassName={classes.overlay}
    >
      {props.renderProp}
    </ReactModal>
  );
};
