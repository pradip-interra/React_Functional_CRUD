import React, { useState, useEffect } from "react";
import ApiCaller from "../api_invoker";
import AddMovieComponent from "./add_movie";
import EditMovieComponent from "./edit_movie";
import DeleteMovieComponent from "./delete_movie";

const MoviesGrid = () => {
  // useState hook
  const [movies, setMovies] = useState([{}]);
  const [addDialogModalState, setAddDialogModalState] = useState(false);
  const [editDialogsModalState, setEditDialogsModalState] = useState([{}]); // every edit dialog has it's own state
  const [ready, setReady] = useState(false); // denote if the API response is there and ready to render per row UI
  const [deleteDialogsModalState, setDeleteDialogsModalState] = useState([{}]); // every delete dialog has it's own state

  const movieApi = ApiCaller("movies");

  function refresh() {
    movieApi
      .get()
      .then((moviesP) => {
        // moviesP is moviePromise
        const data = moviesP.data;
        setMovies(data);
        setReady(true);
        initializeEditDialogsModalState(data);
        initializeDeleteDialogsModalState(data);
      })
      .catch((e) => {
        console.log("Error occured in Movie GET call: " + e);
      });
  }

  // useEffect hook
  useEffect(() => {
    refresh();
  }, []); // there is a last argument like ""}, [<dependencies>] );". as we want it to be used only once, so mentioning as empty array,

  /** Functionality  */
  // once the modal is open, the model child is raising this event to toggle it.
  function toggleAddDialogModalState() {
    return setAddDialogModalState((prevState) => !prevState);
  }

  // these following functions are for edit.
  function toggleEditDialogsModalState(index) {
    // prevState is an array of {id, state}
    const clonedEditDialogsModalState = [...editDialogsModalState];
    const previousState = editDialogsModalState[index];
    clonedEditDialogsModalState[index] = {
      id: previousState.id,
      state: !previousState.state,
    };
    return setEditDialogsModalState(clonedEditDialogsModalState);
  }

  function setEditDialogsState(index) {
    const clonedEditDialogsModalState = [...editDialogsModalState];
    const previousState = editDialogsModalState[index];
    clonedEditDialogsModalState[index] = {
      id: previousState.id,
      state: true,
    };
    return setEditDialogsModalState(clonedEditDialogsModalState);
  }

  function initializeEditDialogsModalState(dataSet) {
    let newState = [];
    dataSet.map((item) => newState.push({ id: item.id, state: false }));
    return setEditDialogsModalState(newState);
  }

  // these following functions are for delete.
  function toggleDeleteDialogsModalState(index) {
    // prevState is an array of {id, state}
    const clonedDeleteDialogsModalState = [...deleteDialogsModalState];
    const previousState = deleteDialogsModalState[index];
    clonedDeleteDialogsModalState[index] = {
      id: previousState.id,
      state: !previousState.state,
    };
    return setDeleteDialogsModalState(clonedDeleteDialogsModalState);
  }

  function setDeleteDialogsState(index) {
    const clonedDeleteDialogsModalState = [...deleteDialogsModalState];
    const previousState = deleteDialogsModalState[index];
    clonedDeleteDialogsModalState[index] = {
      id: previousState.id,
      state: true,
    };
    return setDeleteDialogsModalState(clonedDeleteDialogsModalState);
  }

  function initializeDeleteDialogsModalState(dataSet) {
    let newState = [];
    dataSet.map((item) => newState.push({ id: item.id, state: false }));
    return setDeleteDialogsModalState(newState);
  }

  /** UI components */
  function addButton() {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setAddDialogModalState(true)}
      >
        Add
      </button>
    );
  }

  function addUDButtons(currentRowDataMovie) {
    const currRowDataId = currentRowDataMovie.id;
    return (
      <span>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => setEditDialogsState(currRowDataId)}
        >
          Edit
        </button>
        {editDialogsModalState[currRowDataId] &&
          editDialogsModalState[currRowDataId].state && (
            <EditMovieComponent
              open={editDialogsModalState[currRowDataId].state}
              movie={currentRowDataMovie}
              onToggle={toggleEditDialogsModalState}
              onSucces={refresh}
            />
          )}
        <button
          type="button"
          className="btn btn-info ml-2"
          onClick={() => setDeleteDialogsState(currRowDataId)}
        >
          Delete
        </button>
        {deleteDialogsModalState[currRowDataId] &&
          deleteDialogsModalState[currRowDataId].state && (
            <DeleteMovieComponent
              open={deleteDialogsModalState[currRowDataId].state}
              movie={currentRowDataMovie}
              onToggle={toggleDeleteDialogsModalState}
              onSucces={refresh}
            />
          )}
      </span>
    );
  }
  // conditional styling
  function getListGrpStyle(i) {
    let style = "list-group-item list-group-item-";
    style += i % 2 === 0 ? "success" : "warning";
    return style;
  }

  function buildGrid() {
    if (!ready) {
      // data is not there, why to build the grid
      return;
    }
    const listItems = movies.map((movie, index) => (
      <li key={movie.id} className={getListGrpStyle(index)}>
        {
          <div className="row">
            <div className="col-6">
              <h3>
                <div className="badge sm-2 badge-primary ml-2 w-50">
                  {movie.name}
                </div>
                <div className="badge sm-2 badge-secondary ml-2 w-50">
                  {movie.genre}
                </div>
              </h3>
            </div>
            <div className="col-6">
              <div>{addUDButtons(movie)}</div>
            </div>
            <div className="w-50"></div>
          </div>
        }
      </li>
    ));
    return (
      <ul className="list-group mt-2 border border-primary p-3">{listItems}</ul>
    );
  }

  // final buildUI function, sort of main
  function buildUI() {
    return (
      <div className="ml-5">
        {addButton()}
        {buildGrid()}
        {addDialogModalState && (
          <AddMovieComponent
            open={addDialogModalState}
            onToggle={toggleAddDialogModalState}
            onSucces={refresh}
          />
        )}
      </div>
    );
  }

  /** Final code block */
  return buildUI();
};

export default MoviesGrid;
