import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import Header from '../Header'
import '../../App.css'
import Footer from '../Footer'
import { BACKEND_PORT } from '../../config.json'


function SearchPage() {

  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    getSearch()
  }, [])

  /**
   * for setting up the datagrid
   */
  const columns = [
    { field: 'id', 
      headerName: 'ID', 
      width: 200,
      renderCell: (params) => {
        return(
          <Link to={"/products/" + params.value}>{params.value}</Link>
        )
      }
      },
    { field: 'name', 
      headerName: 'Name', 
      width: 400,
    },
    { 
      field: 'imgurl',
      headerName: 'Picture',
      width: 150,
      renderCell: (params) => {
        return (
        <img src={params.value} style={{width: '45px', height: '45px'}}/>
        )
      }
    },
    {
      field: 'net_price',
      headerName: 'Price',
      width: 110,
    },
    {
      field: 'description',
      headerName: 'Description',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1
    },
  ]

  /**
   * calls the backend to get search results
   */
  async function getSearch() {
    fetch('http://localhost:'+ BACKEND_PORT + '/products/search?query=' + localStorage.getItem("search"),{
      method: 'GET',
    }).then(res => res.text())
      .then(data => {
        const jsonData = JSON.parse(data);
        console.log(jsonData)
        setSearchResult(jsonData)
      })
  }

  /**
   * renders search results into page
   * @returns search results or message that there are non
   */
  const RenderSearch = () => {
    if (searchResult.products === undefined) {
      return (
        <div>Sorry, your search didn't return anything!</div>
      )
    }
    else {
      return (
        <div className={"datagrid"}>
          <DataGrid
            rows={searchResult.products}
            columns={columns}
          />
        </div>
      )
    }
  }

  return (
    <div>
      <Header/>
      <div className={"componentmargin"}>
        <h2 id='header2'>Search Results</h2>
        <RenderSearch/>
      </div>
      <Footer/>
    </div>
  )
}

export default SearchPage