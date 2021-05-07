import "./App.css";
import MoviesGrid from "./components/movies_grid";

function App() {
  return (
    <div>
      <h1>
        <span className="badge badge-secondary mx-auto">CRUD Application</span>
        <MoviesGrid />
      </h1>
    </div>
  );
}

export default App;
