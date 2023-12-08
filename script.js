function App() {
  const [tvShow, setTvShow] = React.useState('');
  const [showInfo, setShowInfo] = React.useState(null);
  const [watchlist, setWatchlist] = React.useState([]);
  const [showWatchlistSection, setShowWatchlistSection] = React.useState(false);
  const [addToWatchlistMessage, setAddToWatchlistMessage] = React.useState('');

  const getShowInfo = () => {
    fetch(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(tvShow)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.name) {
          setShowInfo(data);
        } else {
          console.error('No information found for the entered TV show.');
          setShowInfo(null);
        }
      })
      .catch(error => {
        console.error('Error fetching TV show information:', error);
        setShowInfo(null);
      });
  };

  const addToWatchlist = () => {
    if (showInfo) {
      // Check if the show is not already in the watchlist before adding it
      if (!watchlist.some(item => item.id === showInfo.id)) {
        setWatchlist(prevWatchlist => [...prevWatchlist, showInfo]);
        setAddToWatchlistMessage(`${showInfo.name} has been added to the watchlist.`);
        console.log(`${showInfo.name} added to the watchlist.`);
      } else {
        setAddToWatchlistMessage(`${showInfo.name} is already in the watchlist.`);
        console.log(`${showInfo.name} is already in the watchlist.`);
      }
    } else {
      setAddToWatchlistMessage('Cannot add to watchlist. No show information available.');
      console.error('Cannot add to watchlist. No show information available.');
    }

    // Clear the message after a few seconds (adjust the timeout as needed)
    setTimeout(() => {
      setAddToWatchlistMessage('');
    }, 3000);
  };

  const showWatchlist = () => {
    setShowWatchlistSection(true);
  };

  const closeWatchlist = () => {
    setShowWatchlistSection(false);
  };

  return (
    <div className="container">
      <h1>TV Show Information</h1>
      <label htmlFor="tvShow">Enter your favorite TV show: </label>
      <input
        type="text"
        id="tvShow"
        placeholder="e.g., Golden Girls"
        value={tvShow}
        onChange={(e) => setTvShow(e.target.value)}
      />
      <button onClick={getShowInfo}>Get Information</button>
      <div id="showInfo">
        {showInfo && (
          <div>
            <h2>{showInfo.name}</h2>
            <p>Language: {showInfo.language}</p>
            <p>Genres: {showInfo.genres.join(', ')}</p>
            <p>Summary: {showInfo.summary}</p>
          </div>
        )}
        {!showInfo && <p>No information found for the entered TV show.</p>}
      </div>
      <div className="button-container">
        <button onClick={addToWatchlist}>Add to Watchlist</button>
        {addToWatchlistMessage && <p>{addToWatchlistMessage}</p>}
        <button onClick={showWatchlist}>My Watchlist</button>
      </div>
      {showWatchlistSection && (
        <Watchlist watchlist={watchlist} onClose={closeWatchlist} />
      )}
    </div>
  );
}

function Watchlist({ watchlist, onClose }) {
  return (
    <div className="watchlist">
      <h2>My Watchlist</h2>
      {watchlist.length > 0 ? (
        <ul>
          {watchlist.map(show => (
            <li key={show.id}>{show.name}</li>
          ))}
        </ul>
      ) : (
        <p>Your watchlist is empty.</p>
      )}
      <button onClick={onClose}>Close Watchlist</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
