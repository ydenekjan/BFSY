import ListTile from "../ListTile.tsx";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useUser } from "../../utils/UserContext.tsx";
import axios from "axios";
import { TList } from "../../utils/types/types.ts";

const ListOverview = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [filters, setFilters] = useState({
    ownedOnly: false,
    showArchived: false,
  });
  const [lists, setLists] = useState<TList[]>([]);

  useEffect(() => {
    axios.get("/lists/all").then((res) => {
      setLists(res.data);
    });
  }, []);

  const [filteredLists, setFilteredLists] = useState(lists);

  useEffect(() => {
    filterData();
  }, [lists]);

  const filterData = () => {
    const newData = lists.filter((item) => {
      const { ownedOnly, showArchived } = filters;
      const { archived, author } = item;

      if (ownedOnly && showArchived) return author === user?.fullName;
      if (ownedOnly) {
        return author === user?.fullName && !archived;
      } else if (showArchived) {
        return true;
      }
      return !archived;
    });
    setFilteredLists(newData);
  };

  useEffect(() => {
    filterData();
  }, [filters]);

  return (
    <div className={"w-full h-full flex flex-col"}>
      <header className={"flex justify-between"}>
        <h1 className={"text-2xl"}>Přehled Nákupních Seznamů</h1>

        <button onClick={() => navigate("/novy")}>
          <AddCircleOutlineIcon fontSize={"large"} />
        </button>
      </header>
      <section className={"flex w-full h-fit gap-2 mt-4 flex-wrap"}>
        <Chip
          label={"Pouze vlastněné"}
          deleteIcon={<CheckIcon />}
          onDelete={
            filters.ownedOnly
              ? () => {
                  setFilters({ ...filters, ownedOnly: !filters.ownedOnly });
                }
              : null
          }
          onClick={() => {
            setFilters({ ...filters, ownedOnly: !filters.ownedOnly });
          }}
          color={filters.ownedOnly ? "primary" : "default"}
        />
        <Chip
          label={"Zobrazit archivované"}
          deleteIcon={<CheckIcon />}
          onDelete={
            filters.showArchived
              ? () => {
                  setFilters({
                    ...filters,
                    showArchived: filters.showArchived,
                  });
                }
              : null
          }
          onClick={() => {
            setFilters({
              ...filters,
              showArchived: !filters.showArchived,
            });
          }}
          color={filters.showArchived ? "primary" : "default"}
        />
      </section>
      <section className={"py-8 w-full h-min flex flex-col gap-4"}>
        {user ? (
          filteredLists.length > 0 ? (
            filteredLists.map((value, idx) => (
              <ListTile key={idx} listData={value} />
            ))
          ) : (
            <div>Zadání neodpovídají žádné seznamy.</div>
          )
        ) : (
          <div>Pro zobrazení seznamů se přihlaste.</div>
        )}
      </section>
    </div>
  );
};

export default ListOverview;
