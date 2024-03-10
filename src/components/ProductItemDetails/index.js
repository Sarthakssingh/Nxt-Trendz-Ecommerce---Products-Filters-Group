// Write your code here
import {Component} from 'react'
import {Cookies} from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsList: {},
    quantity: 1,
    similirarProduct: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, option)

    if (response.ok) {
      const responseData = await response.json()
      const updatedData = this.getFormattedData(responseData)
      const updatedSimlirar = responseData.similar_products.map(eachItem =>
        this.getFormattedData(eachItem),
      )
      this.setState({
        productsList: updatedData,
        similirarProduct: updatedSimlirar,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  increment = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  decrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  renderSuccessDetails = () => {
    const {productsList, similirarProduct, quantity} = this.state

    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productsList
    return (
      <div className="success-container">
        <div className="first-container">
          <img src={imageUrl} className="src-image" alt="product" />
          <div className="first-content">
            <h1 className="first-heading">{title}</h1>
            <p className="first-price">Rs {price}/- </p>
            <div className="rating-holder">
              <div className="rating">
                <p className="para">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-img"
                  alt="star"
                />
              </div>
              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p className="first-para">{description}</p>
            <p className="review">
              <span className="first-bold">Available: </span>
              {availability}
            </p>
            <p className="review">
              <span className="first-bold">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="quantity-holder">
              <button
                type="button"
                className="btn"
                data-testid="minus"
                onClick={this.decrement}
              >
                .<BsDashSquare className="btn-icons" />
              </button>
              <p className="number">{quantity}</p>
              <button
                type="button"
                className="btn"
                data-testid="plus"
                onClick={this.increment}
              >
                .<BsPlusSquare className="btn-icons" />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="similar-list">
          {similirarProduct.map(eachItem => (
            <SimilarProductItem key={eachItem.id} productDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderSuccessDetails()
      case 'FAILURE':
        return this.renderFailureView()
      case 'IN_PROGRESS':
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    console.log(apiStatus)
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
