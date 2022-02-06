import {Link} from 'react-router-dom'
import { Box, Card, CardContent, CardMedia } from '@mui/material'

/**
 * Creates a product card that links to that product page
 * 
 * @param {props} props 
 * @returns ProductsRender
 */
export const ProductsRender = (props) => {
  return (
    props.rows.map(data => {
      return (
          <div style={{ marginLeft:"10px",  marginRight:"10px"}}>
            <Link to={"/products/" + data.id}>
              <Card id='card' style={{width: 200, height: 290, marginRight: 25, marginBottom: 10}}>
                  <CardContent>
                      <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Box style={{height: 170}}>
                          <CardMedia
                            component="img"
                            sx={{ width: 150, height: 150, boxShadow: 3 }}
                            image={ data.pic }
                          />
                          {/* <img src={data.pic} style={{height:150, width: 150}}/> */}
                        </Box>
                        <div>
                          <h5>{data.name}</h5>
                          <h6>${data.price}</h6>
                        </div>
                      </div>
                  </CardContent>
                </Card>
            </Link>
          </div>
      )    
    })
  )
}