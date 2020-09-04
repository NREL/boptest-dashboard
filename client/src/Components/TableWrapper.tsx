import React, {cloneElement, useCallback, useState} from 'react';
import {useModal} from 'react-modal-hook';
import ReactModal from 'react-modal';
import {Box, Button, TextField, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {ResultDetails} from './ResultDetails';

const useStyles = makeStyles((theme: Theme) =>
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

interface WrapperProps {
  tableComponent: React.ReactElement;
}

// This TableWrapper is going to take a table of results as a prop,
// and then contain the functionality of showing an individual ResultModal
// when one of the rows of the table has been clicked.

// renders a table of results for user dashboard or the results page.
// this table component on either side is going to need to take as props:
// a list of results from the server/context (eventually),
// and a method that is defined here to display the result detail modal
export const TableWrapper: React.FC<WrapperProps> = props => {
  const classes = useStyles();

  //modal data is going to be a Result
  const [modalData, setModalData] = useState(null);
  const [showModal, hideModal] = useModal(
    () => (
      <ReactModal
        className={classes.modal}
        isOpen
        appElement={document.getElementById('app')}
        onRequestClose={hideModal}
        overlayClassName={classes.overlay}
      >
        <ResultDetails result={modalData} />
      </ReactModal>
    ),
    [modalData]
  );
  const openModal = useCallback(
    data => {
      setModalData(data);
      showModal();
    },
    [modalData]
  );

  return (
    <div>{cloneElement(props.tableComponent, {displayResult: openModal})}</div>
  );
};
