import { useEffect, useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  Container,
  TextField,
} from '@mui/material';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    "overflow-y": "scroll",
    maxHeight: "350px",
    paddingBottom: "15px"
  },
  filterCard: {
    alignItems: "center",
    paddingBottom: "50px",
    marginTop: "15px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)"
  },
  filterCardContent: {
    "overflow": "hidden",
    textAlign: "center"
  },
  filterItem: {
    marginTop: "5px",
    marginBottom: "5px",
    btn: {
      "border-radius": "0%",
      "justify-content": "start"
    }
  },
  reset: {
    marginTop: "15px",
    paddingLeft: "15%",
    paddingRight: "15%",
  }
}));

const initialFilterState = {
  address: "",
  street: "",
  city: "",
};

const Filter = (porps) => {
  const classes = useStyles();

  // const [query, setQuery] = useState("");
  // const [searchParam] = useState(["title", "address"]);

  const [filterState, setFilterState] = useState(initialFilterState);

  const changeHandler = (event) => {
    let newFilterState = { ...filterState };

    for (const [key, value] of Object.entries(filterState)) {
      if (key === event.target.name) {
        if (typeof value === "boolean") {
          newFilterState[key] = !value;
        } else {
          console.log(event.target.name)
          newFilterState[key] = event.target.value;
        }
      };
      setFilterState({ ...newFilterState });

      // TODO: add filtering logic to apartment list
    }
  };

  useEffect(() => {
    console.log(filterState);
  }, [filterState]);

  const resetHandler = () => {
    setFilterState(initialFilterState);
  };

  const content = (
    <>
      <TextField
        id="address"
        name="address"
        label="Address"
        fullWidth
        variant="standard"
        onChange={changeHandler}
        className={classes.filterItem}
        value={filterState.address}
      />
      <TextField
        id="street"
        name="street"
        label="Street"
        fullWidth
        variant="standard"
        onChange={changeHandler}
        className={classes.filterItem}
        value={filterState.street}
      />
      <TextField
        id="city"
        name="city"
        label="City"
        fullWidth
        variant="standard"
        onChange={changeHandler}
        className={classes.filterItem}
        value={filterState.city}
      />
    </>
  );

  return (
    <Container maxWidth={false} className={classes.container}>
      <Card className={classes.filterCard}>
        <CardContent className={classes.filterCardContent}>
          {content}
          <Button
            variant="contained"
            onClick={resetHandler}
            className={classes.reset}
          >
            Reset
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Filter;