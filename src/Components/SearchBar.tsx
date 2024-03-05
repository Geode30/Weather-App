import { useState } from "react";

function SearchBar() {
  const apiKey = "ef05a7ca07b7488bb3031810242602";
  const [textBoxValue, setTextBoxValue] = useState("");
  const [autoCompleteHidden, setAutoCompleteHidden] = useState("hidden");
  const [displayLoading, setDisplayLoading] = useState("hidden");
  const [displayLoadingAutoComplete, setDisplayLoadingAutoComplete] =
    useState("hidden");
  const [initialSearch, setInitialSearch] = useState("");

  const [cityNames, setCityNames] = useState<string[]>([]);

  const fetchAutoCompleteData = async (input: string) => {
    setDisplayLoadingAutoComplete("block");

    await fetch(
      `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${input}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDisplayLoadingAutoComplete("hidden");
        const newCityNames = data.map((city: any) => city.name);
        setCityNames(newCityNames);
      })
      .catch((error) => {
        setDisplayLoadingAutoComplete("hidden");
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });

    console.log(cityNames);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextBoxValue(e.target.value);
    setInitialSearch(e.target.value);

    fetchAutoCompleteData(e.target.value);
  };

  const enterKeySubmitBtn = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      getWeatherData(textBoxValue);
    }
  };

  const handleFocus = () => {
    setAutoCompleteHidden("block");
  };

  const hideAutoComplete = () => {
    setAutoCompleteHidden("hidden");
  };

  const focusSearch = (name: string) => {
    setTextBoxValue(name);
    console.log("You hovered to one of options");
  };

  const outOfFocus = () => {
    setTextBoxValue(initialSearch);
  };

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("");
  const [temperature, setTemperature] = useState("");
  const [infoHidden, setInfoHidden] = useState("hidden");
  const [displayError, setDisplayError] = useState("hidden");

  const getWeatherData = async (city: string) => {
    setDisplayLoading("block");
    setInfoHidden("hidden");
    setDisplayError("hidden");

    await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
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
        setDisplayLoading("hidden");
        setDisplayError("hidden");
        setInfoHidden("block");
        setCountry(data.location.country);
        setCity(data.location.name);
        setCondition(data.current.condition.text);
        setTemperature(data.current.temp_c + " °C");
      })
      .catch((error) => {
        setDisplayLoading("hidden");
        setAutoCompleteHidden("hidden");

        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });

    setTextBoxValue("");
    setInitialSearch("");
  };

  const handleSubmitBtn = () => {
    getWeatherData(textBoxValue);
  };

  const handleAutoComplete = (name: string) => {
    getWeatherData(name);
    setAutoCompleteHidden("hidden");
  };

  return (
    <div className="font-varela-round flex items-center justify-center h-screen bg-gradient-to-b from-dark1_blue to-dark2_blue">
      <div className="flex items-center justify-center flex-col h-[20em] w-[28em] bg-light1_blue/15 backdrop-blur-[40px] border-solid border-2 rounded-xl border-black md:w-[35em] z-20">
        <div
          className="absolute w-screen h-screen z-0"
          onClick={hideAutoComplete}
        ></div>
        <div className="flex items-center justify-center flex-col md:flex-row z-10">
          <div>
            <div className="absolute bg-dark2_blue h-[2.4em] flex items-center justify-center rounded-[0.3em] w-[2.5em]">
              <img
                src="./src/Images/search_icon.png"
                alt="search"
                className="h-[1.5em]"
              />
            </div>

            <div
              className={`absolute flex items-start flex-col w-[24em] h-max bg-light1_blue mt-[2.3em] z-30 ${autoCompleteHidden}`}
              onMouseOut={outOfFocus}
            >
              <ul>
                <li
                  className={`flex bg-dark2_blue text-light1_blue hover:bg-light1_blue hover:text-dark2_blue w-[24em] h-max pt-[0.8em] pb-[0.8em] pl-[3em] cursor-pointer ${displayLoadingAutoComplete}`}
                >
                  Loading ...
                </li>
                {cityNames.map((name, index) => (
                  <li
                    className="flex bg-dark2_blue text-light1_blue hover:bg-light1_blue hover:text-dark2_blue w-[24em] h-max pt-[0.8em] pb-[0.8em] pl-[3em] cursor-pointer"
                    key={index}
                    onClick={() => handleAutoComplete(name)}
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
              onKeyDown={enterKeySubmitBtn}
            />
          </div>

          <button
            className="rounded-lg border-2 mt-[1em] ml-[1em] h-[2.5rem] w-[5em] bg-dark1_blue hover:bg-light1_blue transition ease-in-out duration-500 md:mt-0"
            onClick={handleSubmitBtn}
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
        <div
          className={`flex items-center justify-center flex-col w-[23em] ml-[3em] mt-[2em] ${displayLoading} md:mt-[4em]`}
        >
          <h1 className="text-[2em]">Loading ....</h1>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
