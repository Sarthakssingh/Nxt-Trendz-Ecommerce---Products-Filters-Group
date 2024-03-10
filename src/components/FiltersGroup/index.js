import {FaSearch} from 'react-icons/fa'
import './index.css'

const FiltersGroup = props => {
  const {
    ratingsList,
    categoryOptions,
    changeCategory,
    ratingChange,
    searching,
  } = props

  const onChangeSearch = e => {
    console.log(e.target.value)
  }

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      searching(event.target.value)
    }
  }

  return (
    <div className="filters-group-container">
      <div className="search-bar">
        <input
          className="filter-input"
          type="search"
          placeholder="Search"
          onChange={onChangeSearch}
          onKeyDown={onEnterSearchInput}
        />
        <div className="search-icon-box">
          <FaSearch className="search-icon" />
        </div>
      </div>

      <div className="category-container">
        <h1 className="category-heading">Category</h1>
        <ul className="category-list">
          {categoryOptions.map(eachItem => (
            <li className="container-li">
              <button
                className="category-button"
                type="button"
                key={eachItem.categoryId}
                onClick={() => changeCategory(eachItem.categoryId)}
                value={eachItem.categoryId}
              >
                <p key={eachItem.categoryId}>{eachItem.name}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="category-container">
        <h1 className="rating-heading">Rating</h1>
        <div className="starts-containers">
          {ratingsList.map(eachItem => (
            <button
              className="rating-button"
              type="button"
              key={eachItem.ratingId}
              onClick={() => ratingChange(eachItem.ratingId)}
            >
              <img
                src={eachItem.imageUrl}
                alt={`rating ${eachItem.ratingId}`}
                className="stars"
              />
              <sapn className="rating-span">&Up</sapn>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FiltersGroup
