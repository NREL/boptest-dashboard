import React from 'react';
import ReactModal from 'react-modal';
import {createStyles, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90%',
      maxHeight: '90%',
      width: '1200px',
      backgroundColor: 'white',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      outline: 'none',
      padding: '24px',
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
