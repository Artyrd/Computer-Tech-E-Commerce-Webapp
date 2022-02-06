import React from "react";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";

/**
 * Creates a navigation menu that has buttons that allows the user to nagivate
 * through the customer profile
 * 
 * @returns Navigation
 */
function Navigation() {

    // Use page history
    const history = useHistory();

    // Navigate to edit customer profile
    function handleEdit() {
        history.push("/profile/edit");
    }
    // Navigate to customer order history
    function handleHistory() {
        history.push("/profile/order_history");
    }
    // Navigate to customer wishlist
    function handleWishlist() {
        history.push("/profile/wishlist");
    }
    // Navigate to the customer profile dashboard
    function handleHome() {
        history.push("/profile/" + localStorage.getItem('customerid'));
    }

    // Return navigation buttons
    return(
        <div>
            <h2 id='header2'> Actions </h2>
            <div style={{paddingBottom: 12}}>
                <Button color="lightblue" variant="contained" fullWidth onClick={handleHome}>
                    Customer Dashboard
                </Button>
            </div>
            <div style={{paddingTop: 12, paddingBottom: 12}}>
                <Button color="lightblue" variant="contained" fullWidth onClick={handleEdit}>
                    Edit Profile
                </Button>
            </div>
            <div style={{paddingTop: 12, paddingBottom: 12}}>
                <Button color="lightblue" variant="contained" fullWidth onClick={handleHistory}>
                    View Order History
                </Button>
            </div>
            <div style={{paddingTop: 12, paddingBottom: 12}}>
                <Button color="lightblue" variant="contained" fullWidth onClick={handleWishlist}>
                    View Wishlists
                </Button>
            </div>
        </div>
    )
}

export default Navigation;