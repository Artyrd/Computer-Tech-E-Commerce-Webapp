import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import HomePage from './pages/HomePage';

import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/login/RegisterPage';
import ForgotPasswordPage from './pages/login/ForgotPasswordPage';
import ResetPasswordPage from './pages/login/ResetPasswordPage';

import AdminHomePage from './pages/admin/AdminHomePage';
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import AdminViewProductPage from './pages/admin/AdminViewProductPage';
import SpecialsPage from './pages/admin/SpecialsPage';
import AddDiscountPage from './pages/admin/AddDiscountPage';
import ViewOrdersPage from './pages/admin/ViewOrdersPage';
import ViewSalesStatisticsPage from './pages/admin/ViewSalesStatisticsPage';
import ManageAdminsPage from './pages/admin/ManageAdminsPage';

import CartPage from './pages/cart/CartPage';
import CheckoutOptionPage from './pages/cart/CheckoutOptionPage';
import CheckoutDetailsPage from './pages/cart/CheckoutDetailsPage';
import CheckoutShippingPage from './pages/cart/CheckoutShippingPage';
import CheckoutPaymentPage from './pages/cart/CheckoutPaymentPage';
import CheckoutReviewPage from './pages/cart/CheckoutReviewPage'

import RecommenderPage from './pages/recommender/RecommenderPage'
import QuestionsPage from './pages/recommender/QuestionsPage'
import RecommendationPage from './pages/recommender/RecommendationPage'

import ViewProductsPage from './pages/products/ViewProductsPage';
import ViewProductPage from './pages/products/ViewProductPage';
import ViewProductCategoryPage from './pages/products/ViewProductCategory';

import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';
import ReviewPage from './pages/customer/ReviewPage';
import EditProfilePage from './pages/customer/EditProfilePage';
import WishlistPage from './pages/customer/WishlistPage';

import PriceDropForm from './pages/help/PriceDropForm';
import OrderHelp from './pages/help/OrderHelp';
import About from './pages/help/About';
import Testimonials from './pages/help/Testimonial';
import SearchPage from './pages/search/SearchPage'
import AdminLoginPage from './pages/login/AdminLoginPage';

function App() {
  return (

    <Router>
      <Switch>
        <Route path="/login" component = {LoginPage}></Route>
        <Route path="/register" component = {RegisterPage}></Route>
        <Route path="/forgot_password" component = {ForgotPasswordPage}></Route>
        <Route path="/reset_password" component = {ResetPasswordPage}></Route>

        <Route path="/admin/products/add" component = {AddProductPage}></Route>
        <Route path="/admin/products/view" component = {AdminViewProductPage}></Route>
        <Route path="/admin/products/edit" component = {EditProductPage}></Route>
        <Route path="/admin/products/specials/add" component = {AddDiscountPage}></Route>
        <Route path="/admin/products/specials" component = {SpecialsPage}></Route>
        <Route path="/admin/view_orders" component = {ViewOrdersPage}></Route>
        <Route path="/admin/view_statistics/sales" component = {ViewSalesStatisticsPage}></Route>
        <Route path="/admin/manage/admins" component={ManageAdminsPage}></Route>
        <Route path="/admin/login" component={AdminLoginPage}></Route>
        <Route path="/admin" component = {AdminHomePage}></Route>

        <Route path="/profile/add_review" component = {ReviewPage}></Route>
        <Route path="/profile/order_history" component = {OrderHistoryPage}></Route>
        <Route path="/profile/edit" component = {EditProfilePage}></Route>
        <Route path="/profile/wishlist" component = {WishlistPage}></Route>
        <Route path="/profile" component = {CustomerProfilePage}></Route>

        <Route path="/home"></Route>
        <Route path="/cart/checkout_option" component = {CheckoutOptionPage}></Route>
        <Route path="/cart/checkout_details" component = {CheckoutDetailsPage}></Route>
        <Route path="/cart/checkout_shipping" component = {CheckoutShippingPage}></Route>
        <Route path="/cart/checkout_payment" component = {CheckoutPaymentPage}></Route>
        <Route path="/cart/checkout_review" component = {CheckoutReviewPage}></Route>
        <Route path="/cart" component = {CartPage}></Route>

        <Route path="/recommender/questions" component = {QuestionsPage}></Route>
        <Route path="/recommender/recommendation" component = {RecommendationPage}></Route>
        <Route path="/recommender" component = {RecommenderPage}></Route>

        <Route path="/product/category/:part" component={ViewProductCategoryPage}></Route>
        <Route path="/products/:id" component = {ViewProductPage}></Route>
        <Route path="/products" component = {ViewProductsPage}></Route>

        <Route path="/pricedrop" component = {PriceDropForm}></Route>
        <Route path="/orderhelp" component = {OrderHelp}></Route>
        <Route path="/about" component = {About}></Route>
        <Route path="/testimonials" component = {Testimonials}></Route>
        <Route path="/search" component = {SearchPage}></Route>
        <Route path="/" component = {HomePage}>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
