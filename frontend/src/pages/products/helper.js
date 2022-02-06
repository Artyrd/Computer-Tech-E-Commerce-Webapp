import {Button} from '@material-ui/core';
const CartRender = () => {
  if (JSON.parse(localStorage.getItem('cart')) !== null) {
    return(compileCart())
    
  }
  return (null)
}

function removeItem(name) {
  let previousEntries = JSON.parse(localStorage.getItem("cart"))
  let iterator = 0;
  for (const cartEntry of previousEntries) {
    if (cartEntry.name === name) {
      previousEntries.splice(iterator, 1)
      localStorage.setItem("cart", JSON.stringify(previousEntries))
      break
    }
    iterator = iterator + 1
  }
}

function compileCart() { 
  return(JSON.parse(localStorage.getItem('cart')).map((data)=> {
    return(
      <div className={'sidebarcartdivs'}>
        name: {data.name}
        <br/>
        price: {data.price}
        <br/>
        <Button onClick={() => {
            removeItem(data.name)
          }}>Remove</Button>
      </div>
    )
  }))
}

export const productBrands = ['MSI', 'ASUS', 'Deepcool', 'Corsair', 'Gigabyte', 'be quiet!', 'AMD', 'Intel', 'Samsung', 'Seagate', 'AORUS', "G.SKILL"] 

export default CartRender