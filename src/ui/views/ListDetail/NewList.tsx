import {
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Input,
} from "@mui/material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TListModalProps,
  TModal,
  TModalProps,
} from "../../../utils/types/types.ts";
import BasicModal from "../../modals/BasicModal.tsx";
import NewListMemberModal from "../../modals/NewListMemberModal.tsx";
import { defaultModalProps } from "../../../utils/modals/defaultModalProps.ts";
import axios from "axios";
import _ from "lodash";

const NewList = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<null | number>(null);
  const [newItemName, setNewItemName] = useState("");
  const [formData, setFormData] = useState({
    listName: "",
    members: [],
    items: [],
  });
  const [modalOpen, setModalOpen] = useState({
    newListMember: false,
    deleteList: false,
    saveList: false,
  });

  const handleNewItem = () => {
    if (!newItemName) return;
    const newItem = { itemName: newItemName, completed: false };

    setFormData({ ...formData, items: [...formData.items, newItem] });
    setNewItemName("");
    inputRef.current.blur();
  };
  const handleRemoveMember = (event) => {
    const removedMember = event.currentTarget.dataset.fullName;

    const members = formData.members.filter(
      (member) => member !== removedMember,
    );

    setFormData({
      ...formData,
      members: members,
    });
  };

  const handleDeleteList = () => {
    handleModalState("deleteList");

    //TODO: API - delete list

    navigate("/");
  };

  const handleSaveList = () => {
    handleModalState("saveList");

    axios.post("/lists", _.omitBy(formData, _.isEmpty)).then(() => {
      navigate("/");
    });
  };

  const handleModalState = (modal: TModal) => {
    setModalOpen({ ...modalOpen, [modal]: !modalOpen[modal] });
  };

  const modalProps = defaultModalProps;

  modalProps.saveList = {
    ...modalProps.saveList,
    func: { onClose: handleModalState, onAccept: handleSaveList },
    isOpen: modalOpen.saveList,
  };

  modalProps.deleteList = {
    ...modalProps.deleteList,
    func: { onClose: handleModalState, onAccept: handleDeleteList },
    isOpen: modalOpen.deleteList,
  };

  modalProps.newListMember = {
    isOpen: modalOpen.newListMember,
    listData: formData,
    setListData: setFormData,
    handleState: handleModalState,
  };

  return (
    <section className={"flex w-full h-full pl-8"}>
      <FormControl className={"flex w-full h-full"}>
        <header className={"flex justify-between w-full relative"}>
          <button
            className={"absolute  -left-12"}
            onClick={() => navigate("/")}
          >
            <ArrowCircleLeftOutlinedIcon fontSize={"large"} />
          </button>
          <TextField
            required
            variant="standard"
            slotProps={{
              htmlInput: { style: { fontSize: 28 } },
              inputLabel: { style: { fontSize: 28 } },
            }}
            placeholder={"Název Seznamu"}
            value={formData.listName}
            onChange={({ target }) =>
              setFormData({
                ...formData,
                listName: target.value,
              })
            }
          />
          <div className={"flex gap-4"}>
            <button>
              <RemoveCircleOutlineIcon
                fontSize={"large"}
                color={"error"}
                onClick={() => handleModalState("deleteList")}
              />
            </button>
            <button>
              <SaveIcon
                fontSize={"large"}
                onClick={() => handleModalState("saveList")}
              />
            </button>
          </div>
        </header>
        <div className={"w-full my-4"}>
          <h1 className={"text-lg pb-1 border-b border-gray-400 mb-3"}>
            Členové
          </h1>
          <div className={"flex gap-2 flex-wrap"}>
            {formData.members.map((member, idx) => (
              <Chip
                data-full-name={member}
                key={idx}
                label={member}
                onDelete={isHovered === idx ? handleRemoveMember : null}
                onClick={handleRemoveMember}
                onMouseOver={() => setIsHovered(idx)}
                onMouseOut={() => setIsHovered(null)}
              />
            ))}
            <Chip
              label={"Přidat"}
              onClick={() => handleModalState("newListMember")}
              onDelete={() => handleModalState("newListMember")}
              deleteIcon={<AddCircleRoundedIcon />}
            />
          </div>
        </div>
        <div className={"w-full my-4"}>
          <div className={"flex border-b border-gray-400 mb-3 items-center"}>
            <h1 className={"text-lg mr-4"}>Položky</h1>
          </div>

          <List>
            {formData.items.map((item, idx) => {
              return (
                <ListItem disablePadding key={idx}>
                  <ListItemButton>
                    <ListItemText
                      primary={item?.itemName}
                      sx={{
                        textDecoration: item.completed ? "line-through" : null,
                        textDecorationColor: "lightGrey",
                      }}
                      primaryTypographyProps={{
                        style: {
                          color: item?.completed ? "lightGrey" : "black",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
            <FormControl sx={{ width: "25ch" }} variant="standard">
              <InputLabel htmlFor="new-item">Nová Položka</InputLabel>
              <Input
                inputRef={inputRef}
                onKeyDownCapture={(event) => {
                  if (event.key === "Enter") handleNewItem();
                }}
                value={newItemName}
                onChange={({ target }) =>
                  setNewItemName(target.value as string)
                }
                id="new-item"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleNewItem}>
                      <CheckIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </List>
        </div>
      </FormControl>
      <BasicModal modalProps={modalProps.saveList as TModalProps} />
      <BasicModal modalProps={modalProps.deleteList as TModalProps} />
      <NewListMemberModal
        listMemberModalProps={modalProps.newListMember as TListModalProps}
      />
    </section>
  );
};

export default NewList;
