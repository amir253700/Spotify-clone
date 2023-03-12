import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from "react";
import {
  useGetRecommendationQuery,
  useGetTopArtistsQuery,
  useSearchQuery,
} from "../redux";
import { AlbumFeed, Layout, PlaylistFeed, SongsFeed } from "../components";

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [showRecommendation, setShowRecommendation] = useState<boolean>(true);
  const { data, isLoading, isError } = useGetTopArtistsQuery();
  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
  } = useGetRecommendationQuery({
    seed: data?.items[0]?.id || "",
  });
  console.log(recommendedData);
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchQuery(query);

  let timeoutId: number | null = null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setShowRecommendation(false);
      setQuery(event.target.value);
    }, 1000);
  };

  if (isRecommendedLoading || isSearchLoading || isLoading) {
    return <p>loading New released songs</p>;
  }

  if (isRecommendedError) {
    return <p>error happend while loading New released songs</p>;
  }

  const playlists = (
    <Stack>
      <Typography variant="h1" sx={{ position: "relative", top: 50 }}>
        Playlists
      </Typography>
      <PlaylistFeed playlists={searchData?.playlists?.items} />
    </Stack>
  );

  const tracks = (
    <Stack>
      <Typography variant="h1" sx={{ position: "relative", top: 50 }}>
        Tracks
      </Typography>
      <SongsFeed songs={searchData?.tracks?.items} />
    </Stack>
  );

  const albums = (
    <Stack>
      <Typography variant="h1" sx={{ position: "relative", top: 50 }}>
        Albums
      </Typography>
      <AlbumFeed albums={searchData?.albums?.items} />
    </Stack>
  );

  let componentToRender = null;
  const searchResult =
    query !== "" ? (
      <Stack gap={4}>
        {albums}
        {tracks}
        {playlists}
      </Stack>
    ) : (
      <div></div>
    );

  if (showRecommendation) {
    componentToRender = (
      <Stack>
        <Typography variant="h2" sx={{ mt: 10 }}>
          Don&apos;t know what to listen?
          <br />
          We have some suggestions for you
        </Typography>
        {/* <Typography variant="h2">We have some suggestions for you</Typography> */}
        <SongsFeed songs={recommendedData?.tracks} />
      </Stack>
    );
  } else {
    componentToRender = searchResult;
  }

  return (
    <Layout>
      <Stack sx={{ mt: 5, gap: 2 }} alignItems="">
        <Typography variant="h1" sx={{ mt: 20 }}>
          Find a music
        </Typography>
        <TextField
          id="search"
          type="search"
          label="Search"
          onChange={handleChange}
          sx={{ maxWidth: 400 }}
          InputLabelProps={{
            color: "info",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ fontSize: "28px" }} />
              </InputAdornment>
            ),
          }}
        />
        {componentToRender}
      </Stack>
    </Layout>
  );
};

export default Search;
