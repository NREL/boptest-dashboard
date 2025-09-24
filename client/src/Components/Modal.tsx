import React, {useEffect} from 'react';
import ReactModal from 'react-modal';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90%',
      maxHeight: '90%',
      width: '1200px',
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      outline: 'none',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
      borderRadius: theme.spacing(1.5),
    },
    modalMobile: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: 'none',
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      outline: 'none',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box',
      borderRadius: 0,
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1202,
      backgroundColor: 'rgba(0, 0, 0, .75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

interface ModalProps {
  renderProp: React.ReactElement;
  closeModal: () => void;
}

export const Modal: React.FC<ModalProps> = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const appElement =
    typeof document !== 'undefined' ? document.getElementById('app') : null;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      ReactModal.setAppElement('#app');
    }
  }, []);

  return (
    <ReactModal
      className={isMobile ? classes.modalMobile : classes.modal}
      isOpen
      appElement={appElement || undefined}
      onRequestClose={props.closeModal}
      overlayClassName={classes.overlay}
    >
      {props.renderProp}
    </ReactModal>
  );
};
