# TripNest - Airbnb-Inspired Travel Stay Platform

TripNest is a full-stack travel stay platform inspired by Airbnb. It is built to provide practical experience in developing and managing a complete web application with frontend, backend, database, authentication, authorization, cloud image storage, maps, and geolocation features.

## Features

* Create, view, edit, and delete listings
* Store listing data in MongoDB
* Upload and manage listing images using Cloudinary and Multer
* Image preview and cloud-based image storage
* Responsive and styled user interface
* Reusable EJS layouts using EJS-Mate
* Styled navbar, footer, listing pages, and forms
* Client-side form validation
* Server-side validation using Joi
* Custom error handling using ExpressError
* Centralized error handling
* Custom 404 page
* User signup and login
* User authentication using Passport.js
* Session-based authentication
* Protected routes for authenticated users
* Listing ownership authorization
* Add reviews and ratings
* Star-based rating system
* Display average listing ratings
* View reviews on listings
* Delete individual reviews
* Review author authorization
* Automatically remove reviews when a listing is deleted
* Success and error flash messages
* Session-based flash message handling
* Location-based maps using Mapbox
* Geocoding for listing locations
* Display listing locations on maps
* Search listings by keyword
* Filter listings by categories
* Modular routing using Express Router
* MVC architecture for better project organization
* GitHub-based version control and project management

## Technologies Used

### Frontend

* HTML
* CSS
* JavaScript
* EJS
* EJS-Mate
* Bootstrap

### Backend

* Node.js
* Express.js
* Express Router

### Database

* MongoDB
* Mongoose

### Authentication and Authorization

* Passport.js
* Passport-Local-Mongoose
* Express Session
* Connect Flash

### Validation and Error Handling

* Joi
* ExpressError
* Custom error handling

### Image Upload and Storage

* Multer
* Cloudinary
* Multer Storage Cloudinary

### Maps and Geolocation

* Mapbox
* Geocoding API

### Development Tools

* Git
* GitHub
* Method-Override

## CRUD Operations

* Create - Add new listings and reviews
* Read - View listings, listing details, reviews, ratings, and map locations
* Update - Edit existing listings
* Delete - Remove listings and individual reviews

## Architecture

TripNest follows the MVC (Model-View-Controller) architecture to keep the application organized and maintainable.

* Model - Handles MongoDB schemas and database operations
* View - Uses EJS templates to render the user interface
* Controller - Handles application logic and request processing

The project also uses modular Express routes to separate different application features.

## Search and Categories

TripNest provides listing discovery features that allow users to:

* Search listings using keywords
* Filter listings based on categories
* Browse listings according to their category
* View relevant listing information from search results

## Maps and Geocoding

TripNest integrates Mapbox to provide location-based functionality.

* Convert listing locations into geographical coordinates using geocoding
* Display listing locations on an interactive map
* Store and use geographical coordinates for listings

## Authentication and Authorization

TripNest uses Passport.js for user authentication.

Users can:

* Create an account
* Log in and log out
* Access protected routes
* Create and manage their own listings
* Edit and delete listings they own
* Add reviews to listings
* Delete reviews they have authored

Authorization checks are used to prevent users from modifying resources they do not own.

## Reviews and Ratings

TripNest includes a review and rating system where users can:

* Add reviews to listings
* Give star-based ratings
* View reviews from other users
* View listing ratings
* Delete their own reviews

Listing ratings can be used to calculate and display the overall rating of a listing.

## Image Management

Listing images are uploaded using Multer and stored using Cloudinary.

This allows TripNest to:

* Upload images through forms
* Store images in cloud storage
* Save image URLs and metadata with listings
* Display uploaded images on listing pages

## Error Handling

TripNest includes centralized error handling using custom error classes and Express middleware.

The application handles:

* Invalid listing data
* Invalid review data
* Unauthorized requests
* Authentication errors
* Invalid routes
* 404 errors
* Server-side application errors

## Project Structure

The project follows an MVC-based structure with separate directories for models, routes, controllers, views, middleware, and public assets.

## Version Control

The project is managed using Git and GitHub for version control, source code management, and tracking project development.
