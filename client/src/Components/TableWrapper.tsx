import React, {cloneElement, useCallback, useState} from 'react';
import {useModal} from 'react-modal-hook';
import ReactModal from 'react-modal';
import {Box, Button, TextField, Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {ResultModal} from './ResultModal';

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
  //modal data is going to be a Result
  const [modalData, setModalData] = useState(null);
  const [showModal, hideModal] = useModal(
    () => (
      <ReactModal
        isOpen
        appElement={document.getElementById('app')}
        onRequestClose={hideModal}
      >
        <ResultModal result={modalData} />
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
