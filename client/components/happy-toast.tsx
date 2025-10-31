import { useEffect, useState } from "react"

const CatImage = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 500)
    const hideTimer = setTimeout(() => setVisible(false), 2500)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <div className="absolute -top-5 -right-15 -bottom-4 w-15 overflow-hidden">
      <img
        src="/happy.png"
        alt="Happy Cat"
        className={`h-full w-full object-cover object-top transition-transform duration-500 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      />
    </div>
  )
}

export default CatImage
