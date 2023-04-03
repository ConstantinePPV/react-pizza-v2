import React from 'react'

import Categories from '../components/Categories'
import Sort from '../components/Sort'
import Skeleton from '../components/PizzaBlock/Skeleton'
import PizzaBlock from '../components/PizzaBlock'
import Pagination from '../components/Pagination'
import { SearchContext } from '../App'

const Home = () => {
  const {searchValue} = React.useContext(SearchContext)
  const [items, setItems] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [categoryId, setCategoryId] = React.useState(0)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortType, setSortType] = React.useState({
    name: 'популярности',
    sortProperty: 'rating',
  })

  React.useEffect(() => {
    setIsLoading(true)

    const category = categoryId > 0 ? `category=${categoryId}` : ''
    const search = searchValue ? `&q=${searchValue}` : ''
    const sortBy = sortType.sortProperty.replace('-', '')
    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc'

    fetch(`http://localhost:3001/pizzas?_page=${currentPage}&_limit=4&${category}&_sort=${sortBy}&_order=${order}${search}`)
      .then((res) => res.json())
      .then((arr) => {
        setItems(arr)
        setIsLoading(false)
        console.log(categoryId)
      })
    window.scrollTo(0, 0)
  }, [categoryId, sortType, searchValue, currentPage])

  const skeletons = [...new Array(8)].map((_, index) => <Skeleton key={index}/>)
  const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />)

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          value={categoryId}
          onChangeCategory={(i) => setCategoryId(i)}
        />
        <Sort value={sortType} onChangeSort={(i) => setSortType(i)}/>
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination onChangePage={number => setCurrentPage(number)}/>
    </div>
  )
}

export default Home
