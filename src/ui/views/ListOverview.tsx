import ListTile from "../ListTile.tsx";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import lists from "../../../../mockup_data/shopping-lists.json";

const ListOverview = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    ownedOnly: false,
    disableArchived: true,
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const baseData = lists.filter(
    (list) =>
      list.author === currentUser.name ||
      list.members.includes(currentUser.name),
  );
  const [filteredLists, setFilteredLists] = useState(baseData);

  useEffect(() => {
    const newData = baseData.filter((item) => {
      if (filters.ownedOnly && filters.disableArchived) {
        return item.author === currentUser.name && item.active;
      } else if (filters.ownedOnly) {
        return item.author === currentUser.name;
      } else if (filters.disableArchived) {
        return item.active;
      } else {
        return true;
      }
    });
    setFilteredLists(newData);
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
            !filters.disableArchived
              ? () => {
                  setFilters({
                    ...filters,
                    showArchived: !filters.disableArchived,
                  });
                }
              : null
          }
          onClick={() => {
            setFilters({
              ...filters,
              disableArchived: !filters.disableArchived,
            });
          }}
          color={!filters.disableArchived ? "primary" : "default"}
        />
      </section>
      <section className={"py-8 w-full h-min flex flex-col gap-4"}>
        {filteredLists.length > 0 ? (
          filteredLists.map((value, idx) => (
            <ListTile key={idx} listData={value} />
          ))
        ) : (
          <div>Zadání neodpovídají žádné seznamy.</div>
        )}
      </section>
    </div>
  );
};

export default ListOverview;
