import { useSelector } from "react-redux"
import Header from "../../components/Header"
import Hero from "../../components/Hero"
import Profile from "./Profile"


const Home = () => {
  const { userInfo } = useSelector((state) => state.auth)
  return (
    <>
      < Header />
      {userInfo ? (
        <Profile />
      ) :
        (
          <Hero />
        )
      }
    </>
  )
}

export default Home
