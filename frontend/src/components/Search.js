import {React, useState} from 'react';
import SearchBar from "material-ui-search-bar";
import {useHistory, useLocation} from "react-router-dom"

/**
 * Creates search bar which navigates a user to a products that fit key terms 
 * in the search query
 * 
 * @returns Search
 */
function Search() {

  let history = useHistory();
  const location = useLocation();

    const [search, setSearch] = useState("");

    function doSearch() {
        localStorage.setItem("search", search)
        if (search !== "") {
          if (location.pathname === '/search') {
            history.go(0)
          }
          else {
            history.push('/search')
          }
        }
    }

    return(
        <SearchBar
            value={search}
            onChange={(newValue) => setSearch(newValue)}
            onRequestSearch={() => doSearch()}
            style={{width: "min(500px, 50vw)"}}
        />
    )

}

export default Search;