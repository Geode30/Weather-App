import { useState } from "react";

function SearchBar() {
  const [enteredCity, setEnteredCity] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredCity(e.target.value);
  };

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("");
  const [temperature, setTemperature] = useState("");

  const getData = () => {
    const apiKey = "ef05a7ca07b7488bb3031810242602";

    fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${enteredCity}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCountry(data.location.country);
        setCity(data.location.name);
        setCondition(data.current.condition.text);
        setTemperature(data.current.temp_c + " °C");
      });
  };

  return (
    <div className="font-varela-round flex items-center justify-center h-screen bg-gradient-to-b from-dark1_blue to-dark2_blue">
      <div className="flex items-center justify-center flex-col h-screen w-[35rem] bg-light1_blue/15 backdrop-blur-[40px] border-solid border-2 rounded-xl border-black">
        <div className="flex items-center justify-center flex-col md:flex-row">
          <div>
            <img
              src="./src/Images/search_icon.png"
              alt="search"
              className="absolute h-5 ml-[1rem] mt-[0.5rem]"
            />
            <input
              className="text-white rounded-lg border-b-2 border-dark2_blue focus:border-2 outline-none w-96 h-10 bg-dark2_blue placeholder-gray-light pl-12"
              type="text"
              name="search"
              placeholder="Enter a City ..."
              onChange={handleChange}
            />
          </div>
          <button
            className="rounded-lg border-2 mt-[2rem] ml-[1rem] h-[2.5rem] w-[5rem] bg-dark1_blue hover:bg-light1_blue transition ease-in-out duration-500 md:mt-0"
            onClick={getData}
          >
            Submit
          </button>
        </div>

        <div className="flex items-center justify-center flex-col mt-[3rem] ml-[1rem]">
          <h1 className="text-[2rem]">{country}</h1>
          <h1 className="text-[1.5rem]">{city}</h1>
          <h1 className="text-[1rem]">{temperature}</h1>
          <h1 className="text-[1rem]">{condition}</h1>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
