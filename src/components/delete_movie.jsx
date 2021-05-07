import React, { useState } from "react";
import ApiCaller from "../api_invoker";
import { Modal } from "react-bootstrap";

const DeleteMovieComponent = (props) => {
  // useState hook
  const { id } = props.movie;
  const [isModalOpen, setModalStatus] = useState(props.open); // for dialog show/hide object.
  const [error, setError] = useState(false);

  const movieApi = ApiCaller("movies");

  // functionality
  function toggleModal() {
    const toggledState = !isModalOpen; // blocking line
    setModalStatus(toggledState); // is not blocking, can execute little later, it's asynchronous.
    props.onToggle(id); // notify back to the parent
  }

  function handleSubmit() {
    movieApi
      ._delete(id)
      .then((responseP) => {
        console.log("Deleted movie: " + JSON.stringify(responseP.data));
        toggleModal();
        props.onSucces();
      })
      .catch((e) => {
        console.log("Error occured in Movie DELETE call: " + e);
        setError(true);
      });
  }

  return (
    <Modal
      className="modal-container"
      show={isModalOpen}
      onHide={() => toggleModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete movie</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <div id="error" className="text-danger">
            <p>
              Error occured when submitting the request. See console for
              details.
            </p>
          </div>
        )}
        <div className="border border-secondary">
          <p className="pl-1">
            This will delete the movie. Be sure before clicking the Delete
            button.
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="submit"
          className="button button-primary"
          onClick={() => handleSubmit()}
        >
          Delete
        </button>
        <button
          className="button button-secondary"
          onClick={() => toggleModal()}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteMovieComponent;
