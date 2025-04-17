"use client";

import React from "react";

const Search = ({
  searchInput,
  setSearchInput,
}: {
  searchInput: string;
  setSearchInput: (value: string) => void;
}) => {
  return (
    <form className="border border-black p-2 rounded bg-white">
      <input
        className="outline-none bg-white"
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="search posts"
      />
    </form>
  );
};

export default Search;
