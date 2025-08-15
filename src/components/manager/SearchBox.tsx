import React from "react";
interface prop {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBox = ({ setSearchText }: prop) => {
  return (
    <div>
      <label htmlFor="searchBox" className="text-sm mr-2">Search</label>
      
      <input
        name="searchBox"
        className="border border-gray-300 rounded-2xl p-2 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-xs"
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Seach by name ..."
      />
    </div>
  );
};

export default SearchBox;
