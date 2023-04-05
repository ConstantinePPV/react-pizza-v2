import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setCategoryId } from '../redux/slices/filterSlice'
import Categories from '../components/Categories'
import Sort from '../components/Sort'
import Skeleton from '../components/PizzaBlock/Skeleton'
import PizzaBlock from '../components/PizzaBlock'
import Pagination from '../components/Pagination'
import { SearchContext } from '../App'


const Home = () => {
  const dispatch = useDispatch()
  const { categoryId, sort } = useSelector((state) => state.filter)

  const { searchValue } = React.useContext(SearchContext)
  const [ items, setItems ] = React.useState([])
  const [ isLoading, setIsLoading ] = React.useState(true)
  const [ currentPage, setCurrentPage ] = React.useState(1)

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id))
  }

  React.useEffect(() => {
    setIsLoading(true)

    const category = categoryId > 0 ? `category=${ categoryId }` : ''
    const search = searchValue ? `&q=${ searchValue }` : ''
    const sortBy = sort.sortProperty.replace('-', '')
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'

    fetch(`http://localhost:3001/pizzas?_page=${ currentPage }&_limit=4&${ category }&_sort=${ sortBy }&_order=${ order }${ search }`)
      .then((res) => res.json())
      .then((arr) => {
        setItems(arr)
        setIsLoading(false)
      })
    window.scrollTo(0, 0)
  }, [ categoryId, sort.sortProperty, searchValue, currentPage ])

  const skeletons = [ ...new Array(8) ].map((_, index) => <Skeleton key={ index }/>)
  const pizzas = items.map((obj) => <PizzaBlock key={ obj.id } { ...obj } />)

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          value={ categoryId }
          onChangeCategory={ onChangeCategory }
        />
        <Sort/>
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{ isLoading ? skeletons : pizzas }</div>
      <Pagination onChangePage={ number => setCurrentPage(number) }/>
    </div>
  )
}

export default Home
