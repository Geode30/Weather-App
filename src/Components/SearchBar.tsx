import React, { useState, useRef, useEffect } from "react";
function SearchBar() {
  const [textBoxValue, setTextBoxValue] = useState("");
  const [autoCompleteHidden, setAutoCompleteHidden] = useState("hidden");
  const [displayLoading, setDisplayLoading] = useState("hidden");
  const [displayLoadingAutoComplete, setDisplayLoadingAutoComplete] =
    useState("hidden");
  const [hideSearchResults, setHideSearchResults] = useState("hidden");
  const [initialSearch, setInitialSearch] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [movePlaceHolder, setMovePlaceHolder] = useState("");
  const [cityNames, setCityNames] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("");
  const [temperature, setTemperature] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isDay, setIsDay] = useState("");
  const [conditionIcon, setConditionIcon] = useState("");
  const [infoHidden, setInfoHidden] = useState("hidden");
  const [displayError, setDisplayError] = useState("hidden");
  const [autoCompleteVisible, setAutoCompleteVisible] = useState(false);
  const [containerSize, setContainerSize] = useState("[20em]");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isHovered) {
      if (e.key === "ArrowUp") {
        // Move selection up
        setSelectedItemIndex((prevIndex) => Math.max(prevIndex - 1, -1));
      } else if (e.key === "ArrowDown") {
        // Move selection down
        setSelectedItemIndex((prevIndex) =>
          Math.min(prevIndex + 1, cityNames.length - 1)
        );
      }
    }

    if (e.key === "Enter") {
      getWeatherData(textBoxValue);
      setAutoCompleteHidden("hidden");
    }
  };

  useEffect(() => {
    if (autoCompleteVisible) {
      if (selectedItemIndex !== -1) {
        const selectedCity = cityNames[selectedItemIndex];
        setTextBoxValue(selectedCity); // Update the textbox value
      } else {
        setTextBoxValue(initialSearch);
      }
    }
  }, [selectedItemIndex]);

  const fetchAutoCompleteData = async (input: string) => {
    setDisplayLoadingAutoComplete("block");
    setHideSearchResults("hidden");

    await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&q=${input}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDisplayLoadingAutoComplete("hidden");
        setHideSearchResults("block");
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

  useEffect(() => {
    fetchAutoCompleteData;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextBoxValue(e.target.value);

    if (textBoxValue === initialSearch) {
      setInitialSearch(e.target.value);
    }

    fetchAutoCompleteData(e.target.value);
    setSelectedItemIndex(-1);
  };

  const handleFocus = () => {
    setAutoCompleteVisible(true);
    setAutoCompleteHidden("block");
    setTextBoxValue(initialSearch);

    setMovePlaceHolder("transform translate-y-[-1.2em] transition-all linear");
  };

  const hideAutoComplete = () => {
    setAutoCompleteVisible(false);
    setSelectedItemIndex(-1);
    setTextBoxValue("");
    setAutoCompleteHidden("hidden");
    setMovePlaceHolder("transform translate-y-[0em] transition-all linear");
  };

  const focusSearch = (name: string) => {
    setIsHovered(true);
    setTextBoxValue(name);
    console.log("You hovered to one of options");
  };

  const autoCompleteMouseOut = () => {
    setIsHovered(false);
  };

  const outOfFocus = () => {
    setTextBoxValue(initialSearch);
  };

  const placeHolderClick = () => {
    inputRef.current?.focus();
    setMovePlaceHolder("transform translate-y-[-1.2em] transition-all linear");
  };

  const getWeatherData = async (city: string) => {
    setDisplayLoading("block");
    setInfoHidden("hidden");
    setDisplayError("hidden");
    setAutoCompleteHidden("hidden");
    setContainerSize("[auto] pt-[2em] pb-[2em] ");

    setTextBoxValue("");
    setInitialSearch("");
    inputRef.current?.blur();
    setMovePlaceHolder("transform translate-y-[0em] transition-all linear");

    await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&q=${city}`
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
        setTemperature(`${data.current.temp_c} °C`);
        setLastUpdated(`Last Updated: ${data.current.last_updated}`);
        setIsDay(() => (data.current.is_day === 1 ? "Day" : "Night"));
        console.log(data.current.is_day);
        setConditionIcon(data.current.condition.icon);
        console.log(conditionIcon);
      })
      .catch((error) => {
        setDisplayLoading("hidden");
        setAutoCompleteHidden("hidden");

        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  useEffect(() => {
    getWeatherData;
  }, []);

  const handleSubmitBtn = () => {
    getWeatherData(textBoxValue);
  };

  const handleAutoComplete = (name: string) => {
    getWeatherData(name);
    setAutoCompleteHidden("hidden");

    setTextBoxValue("");
    setInitialSearch("");
  };

  return (
    <div className="font-varela-round flex items-center justify-center h-screen bg-gradient-to-b from-dark1_blue to-dark2_blue">
      <div
        className={`flex items-center justify-center flex-col h-${containerSize} w-[28em] bg-light2_blue bg-opacity-[0.8] backdrop-blur-[10px] shadow-3xl rounded-xl md:w-[35em] z-20`}
      >
        <div
          className="absolute w-screen h-screen z-0"
          onClick={hideAutoComplete}
        ></div>
        <div className="flex items-center justify-center flex-col md:flex-row z-10">
          <h1
            className={`absolute ml-[1em] mb-[3.5em] rounded-[1em] bg-light2_blue font-bold text-dark2_blue md:mt-[3.5em] md:mr-[5.5em] ${movePlaceHolder}`}
            onClick={placeHolderClick}
          >
            Enter a city
          </h1>
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
                    className={
                      index === selectedItemIndex
                        ? `flex bg-light1_blue text-dark2_blue hover:bg-light1_blue hover:text-dark2_blue w-[24em] h-max pt-[0.8em] pb-[0.8em] pl-[3em] cursor-pointer ${hideSearchResults}`
                        : `flex bg-dark2_blue text-light1_blue hover:bg-light1_blue hover:text-dark2_blue w-[24em] h-max pt-[0.8em] pb-[0.8em] pl-[3em] cursor-pointer ${hideSearchResults}`
                    }
                    key={index}
                    onClick={() => handleAutoComplete(name)}
                    onMouseOver={() => focusSearch(name)}
                    onMouseOut={autoCompleteMouseOut}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <input
              className="bg-light2_blue text-dark2_blue font-bold rounded-lg border-b-2 border-dark2_blue outline-none w-[24em] h-10 border-2 pl-12"
              type="text"
              name="search"
              ref={inputRef}
              value={textBoxValue}
              autoComplete="off"
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="rounded-lg border-2 border-dark2_blue text-light1_blue font-bold mt-[1em] ml-[1em] h-[2.5rem] w-[5em] bg-dark2_blue hover:bg-light1_blue hover:text-dark2_blue transition ease-in-out duration-500 md:mt-0"
            onClick={handleSubmitBtn}
          >
            Submit
          </button>
        </div>

        <div
          className={`flex items-center font-bold justify-center flex-col text-center text-dark2_blue mt-[3em] ml-[1em] md:ml-[0em] ${infoHidden}`}
        >
          <div className="flex items-center justify-center flex-col">
            <h1 className="text-[2em]">{country}</h1>
            <h1 className="text-[1.5em]">{city}</h1>
          </div>
          <div className="flex items-center justify-center flex-col">
            <img
              src={conditionIcon}
              alt="WeatherIcon"
              className="h-[12em] w-[15em]"
            />
          </div>
          <div className="flex items-center justify-center flex-col text-[1em]">
            <h1 className="text-[1.5em]">{isDay}</h1>
            <h1>{temperature}</h1>
            <h1>{condition}</h1>
          </div>
        </div>
        <h1
          className={`text-[0.9em] text-center font-bold text-dark2_blue mt-[1em] ml-[1em] md:ml-[0em] ${infoHidden}`}
        >
          {lastUpdated}
        </h1>
        <div
          className={`flex items-center justify-center flex-col w-[23em] ml-[0.5em] mt-[1.5em] ${displayError} md:mt-[2em]`}
        >
          <h1 className="text-[1.2em] text-dark2_blue">
            Something is wrong, whether there is no result or your internet
            connection is bad
          </h1>
        </div>
        <div
          className={`flex items-center justify-center flex-col w-[23em] ml-[3em] mt-[2em] ${displayLoading} md:mt-[4em] text-dark2_blue`}
        >
          <h1 className="text-[2em]">Loading ....</h1>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
