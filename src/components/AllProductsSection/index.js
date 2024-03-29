import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    // isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, titleSearch, category, rating} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onClearFilter = () => {
    this.setState(
      {
        titleSearch: '',
        category: '',
        rating: '',
      },
      this.getProducts,
    )
  }

  changeCategory = category => {
    this.setState(
      {
        category,
      },
      this.getProducts,
    )
  }

  ratingChange = rating => {
    this.setState(
      {
        // rating: `rating${rating}`,
        rating,
      },
      this.getProducts,
    )
  }

  searching = titleSearch => {
    this.setState({titleSearch}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList.length === 0) {
      return (
        <div className="no-product-container">
          <img
            className="no-product-img"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
          />
          <h1 className="no-product-heading">No Products Found</h1>
          <p className="no-product-para">
            We could not find any products. Try with another filter.
          </p>
        </div>
      )
    }

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailure = () => (
    <div className="failure-products-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We are having some trouble processing your request. <br /> Please try
        again.
      </p>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return (
          <div className="all-products-section">
            <div className="filter-group">
              <FiltersGroup
                ratingsList={ratingsList}
                categoryOptions={categoryOptions}
                changeCategory={this.changeCategory}
                ratingChange={this.ratingChange}
                searching={this.searching}
              />
              <button
                type="button"
                className="clear-filter"
                onClick={this.onClearFilter}
              >
                Clear Filters
              </button>
            </div>
            {this.renderProductsList()}
          </div>
        )
      case 'FAILURE':
        return (
          <div className="all-products-section">
            <div className="filter-group">
              <FiltersGroup
                ratingsList={ratingsList}
                categoryOptions={categoryOptions}
                changeCategory={this.changeCategory}
                ratingChange={this.ratingChange}
                searching={this.searching}
              />
              <button
                type="button"
                className="clear-filter"
                onClick={this.onClearFilter}
              >
                Clear Filters
              </button>
            </div>
            {this.renderFailure()}
          </div>
        )
      case 'IN_PROGRESS':
        return (
          <div className="all-products-section">
            <div className="filter-group">
              <FiltersGroup
                ratingsList={ratingsList}
                categoryOptions={categoryOptions}
                changeCategory={this.changeCategory}
                ratingChange={this.ratingChange}
                searching={this.searching}
              />
              <button
                type="button"
                className="clear-filter"
                onClick={this.onClearFilter}
              >
                Clear Filters
              </button>
            </div>
            {this.renderLoader()}
          </div>
        )
      default:
        return null
    }

    // return (
    //   <div className="all-products-section">
    //     <FiltersGroup />
    //     {this.renderProductsList()}
    //   </div>
    // )
  }
}

export default AllProductsSection
