import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Loading = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    const timer = setTimeout(()=>{
      navigate('/')
    },6000)
    return ()=>clearTimeout(timer)
  },[])
  return (
    <div className="bg-gradient-to-b from-purple-500 to-purple-800 backdrop-opacity-60 flex items-center justify-center h-screen w-screen text-white text-2xl">
      <div className="w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin">

      </div>
    </div> 
  )
}
export default Loading