import { useState } from "react";

function SearchBar() {
  const apiKey = "ef05a7ca07b7488bb3031810242602";
  const [enteredCity, setEnteredCity] = useState("");
  const [textBoxValue, setTextBoxValue] = useState("");
  const [autoCompleteHidden, setAutoCompleteHidden] = useState("hidden");
  const [initalValue, setInitialValue] = useState("");
  const [submitBtnClicked, setSubmitBtnClicked] = useState(false);

  const [cityNames, setCityNames] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredCity(e.target.value);
    setTextBoxValue(e.target.value);
    setInitialValue(e.target.value);
    console.log(e.target.value);

    fetch(
      `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${enteredCity}`
    )
      .then((res) => res.json())
      .then((data) => {
        const newCityNames = data.map((city: any) => city.name);
        setCityNames(newCityNames);
      });

    console.log(cityNames);
  };

  const handleFocus = () => {
    setAutoCompleteHidden("block");
  };

  const outFocus = () => {
    setAutoCompleteHidden("hidden");
  };

  const focusSearch = (name: string) => {
    setInitialValue(textBoxValue);
    setTextBoxValue(name);
  };

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("");
  const [temperature, setTemperature] = useState("");
  const [infoHidden, setInfoHidden] = useState("hidden");
  const [displayError, setDisplayError] = useState("hidden");

  const getData = () => {
    fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${enteredCity}`
    )
      .then((res) => {
        if (!res.ok) {
          setDisplayError("block");
          setInfoHidden("hidden");
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setDisplayError("hidden");
        setInfoHidden("block");
        setCountry(data.location.country);
        setCity(data.location.name);
        setCondition(data.current.condition.text);
        setTemperature(data.current.temp_c + " °C");
        console.log(enteredCity);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const handleClickAutoComplete = (name: string) => {
    setSubmitBtnClicked(true);
    setEnteredCity(name);
    setTextBoxValue(name);
    console.log(name);
    console.log(enteredCity);
    console.log(textBoxValue);
    setAutoCompleteHidden("hidden");
  };

  return (
    <div className="font-varela-round flex items-center justify-center h-screen bg-gradient-to-b from-dark1_blue to-dark2_blue">
      <div className="flex items-center justify-center flex-col h-[20em] w-[28em] bg-light1_blue/15 backdrop-blur-[40px] border-solid border-2 rounded-xl border-black md:w-[35em]">
        <div className="flex items-center justify-center flex-col md:flex-row">
          <div>
            <div className="absolute bg-dark2_blue h-[2.4em] flex items-center justify-center rounded-[0.3em] w-[2.5em]">
              <img
                src="./src/Images/search_icon.png"
                alt="search"
                className="h-[1.5em]"
              />
            </div>

            <div
              className={`absolute flex items-start flex-col w-[24em] h-max bg-light1_blue mt-[2.3em] ${autoCompleteHidden}`}
            >
              <ul>
                {cityNames.map((name, index) => (
                  <li
                    className="flex bg-dark2_blue text-light1_blue hover:bg-light1_blue hover:text-dark2_blue w-[24em] h-max pt-[0.8em] pb-[0.8em] pl-[3em]"
                    key={index}
                    onClick={() => handleClickAutoComplete(name)}
                    onMouseOver={() => focusSearch(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <input
              className="text-black rounded-lg border-b-2 border-dark2_blue focus:border-2 outline-none w-[24em] h-10 bg-light1_blue placeholder-dark2_blue pl-12"
              type="text"
              name="search"
              value={textBoxValue}
              autoComplete="off"
              placeholder="Enter a City ..."
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={outFocus}
            />
          </div>

          <button
            className="rounded-lg border-2 mt-[1em] ml-[1em] h-[2.5rem] w-[5em] bg-dark1_blue hover:bg-light1_blue transition ease-in-out duration-500 md:mt-0"
            onClick={getData}
          >
            Submit
          </button>
        </div>

        <div
          className={`flex items-center justify-center flex-col mt-[1em] ml-[1em] md:mt-[3em] ${infoHidden}`}
        >
          <h1 className="text-[2em]">{country}</h1>
          <h1 className="text-[1.5em]">{city}</h1>
          <h1 className="text-[1em]">{temperature}</h1>
          <h1 className="text-[1em]">{condition}</h1>
        </div>
        <div
          className={`flex items-center justify-center flex-col w-[23em] ml-[0.5em] mt-[1.5em] ${displayError} md:mt-[2em]`}
        >
          <h1 className="text-[1.2em]">
            Something is wrong, whether there is no result or your internet
            connection is bad
          </h1>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
