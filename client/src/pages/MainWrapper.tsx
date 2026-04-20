import BottomNav from '../components/shared/BottomNav'
import { Outlet } from 'react-router-dom'

const MainWrapper = () => {
  return (
    <>
    <Outlet/>
    <BottomNav/>
    </>
  )
}

export default MainWrapper