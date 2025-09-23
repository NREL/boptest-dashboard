import React, {useEffect} from 'react';
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
      outline: 'none',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
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
  closeModal: () => void;
}

export const Modal: React.FC<ModalProps> = props => {
  const classes = useStyles();
  const appElement =
    typeof document !== 'undefined' ? document.getElementById('app') : null;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      ReactModal.setAppElement('#app');
    }
  }, []);

  return (
    <ReactModal
      className={classes.modal}
      isOpen
      appElement={appElement || undefined}
      onRequestClose={props.closeModal}
      overlayClassName={classes.overlay}
    >
      {props.renderProp}
    </ReactModal>
  );
};
