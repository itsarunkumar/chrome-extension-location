import { useState } from "react"

import "./styles.css"

function IndexPopup() {
  const [click, setClick] = useState(0)
  const [loading, setLoading] = useState(false)
  const [locationData, setLocationData] = useState(null)
  const [error, setError] = useState(null)

  const fetchLocationData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const ipdata = await response.json()

      const reResponse = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.PLASMO_PUBLIC_API_KEY}&ipAddress=${ipdata.ip}`
      )
      const reData = await reResponse.json()
      let regionNames = new Intl.DisplayNames(["en"], { type: "region" })
      // regionNames.of('US');  // "United States"
      const locationData = {
        country: regionNames.of(reData.location.country),
        city: reData.location.city
      }

      setLocationData(locationData)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Error fetching data")
    } finally {
      setLoading(false)
    }
  }

  const handleButtonClick = async (e) => {
    e.preventDefault()
    await fetchLocationData()
    setClick((prevClick) => prevClick + 1)
  }

  return (
    <div className="w-[500px] h-[500px] bg-slate-600 flex justify-center items-center flex-col-reverse">
      <button
        className="btn bg-white rounded-sm px-3 py-4 font-bold text-xl"
        onClick={handleButtonClick}
        disabled={loading}>
        {loading ? "Loading" : "Show my location"}
      </button>

      {error ? (
        <p className="my-5 text-2xl text-red-600">Error in fetching data</p>
      ) : (
        <p className="my-5 text-2xl text-white">
          {locationData &&
            `Your country is ${locationData.country} and city is ${locationData.city}`}
        </p>
      )}
    </div>
  )
}

export default IndexPopup
