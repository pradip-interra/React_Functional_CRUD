import React, { useState } from "react";
import ApiCaller from "../api_invoker";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";

const EditMovieComponent = (props) => {
  // useState hook
  const { id, name, genre } = props.movie;
  const [movie, setMovie] = useState({ name, genre }); // for submit movie object
  const [isModalOpen, setModalStatus] = useState(props.open); // for dialog show/hide object.
  const [error, setError] = useState(false);

  const movieApi = ApiCaller("movies");

  // functionality
  function toggleModal() {
    const toggledState = !isModalOpen; // blocking line
    setModalStatus(toggledState); // is not blocking, can execute little later, it's asynchronous.
    props.onToggle(id); // notify back to the parent
  }

  function handleSubmit(formData) {
    setMovie(formData);
    movieApi
      .put(id, formData)
      .then((responseP) => {
        console.log(
          "Movie is edited, response from PUT: " +
            JSON.stringify(responseP.data)
        );
        toggleModal();
        props.onSucces();
      })
      .catch((e) => {
        console.log("Error occured in Movie PUT call: " + e);
        setError(true);
      });
  }

  // Formik section
  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Required";
    } else if (values.name.length < 3) {
      errors.name = "Must be 3 characters or more";
    }

    if (!values.genre) {
      errors.genre = "Required";
    } else if (values.genre.length < 3) {
      errors.genre = "Must be 3 characters or more";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: movie,
    validate,
    onSubmit: (values) => {
      // somehow could not able to execute this Formik stuff
      console.log("onSubmit.");
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Modal
      className="modal-container"
      show={isModalOpen}
      onHide={() => toggleModal()}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit movie</Modal.Title>
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
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="name" className="mr-3">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="input"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-danger">{formik.errors.name}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="genre" className="mr-3">
              Genre
            </label>
            <input
              id="genre"
              name="genre"
              type="input"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.genre}
            />
            {formik.touched.genre && formik.errors.genre ? (
              <div className="text-danger">{formik.errors.genre}</div>
            ) : null}
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="submit"
          className="button button-primary"
          onClick={() => handleSubmit(formik.values)}
          disabled={formik.errors.name || formik.errors.genre}
        >
          Edit
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

export default EditMovieComponent;
