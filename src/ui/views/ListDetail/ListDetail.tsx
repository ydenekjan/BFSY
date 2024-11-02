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
  Switch,
} from "@mui/material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useUser } from "../../../utils/UserContext.tsx";
import ArchiveIcon from "@mui/icons-material/Archive";

const ListDetail = () => {
  const params = useParams();
  const inputRef = useRef(null);
  const listId = params.id;
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<null | number>(null);
  const [newItemName, setNewItemName] = useState("");
  const [disableCompleted, setDisableCompleted] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [modalOpen, setModalOpen] = useState({
    newListMember: false,
    deleteList: false,
    saveList: false,
    archiveList: false,
    leavePage: false,
    leaveList: false,
  });
  const [formData, setFormData] = useState({
    listName: "",
    members: [],
    items: [],
  });
  const { user } = useUser();
  const isAuthor = user?.fullName === formData.author;

  useEffect(() => {
    axios.get(`lists/${listId}`).then((res) => setFormData(res.data));
  }, []);

  const handleNewItem = () => {
    if (!newItemName) return;
    const newItem = { itemName: newItemName, completed: false };

    setFormData({ ...formData, items: [...formData.items, newItem] });
    setNewItemName("");
    inputRef.current.blur();
    setIsUpdated(true);
  };

  const handleItemUpdate = (idx: number) => {
    setFormData((prevData) => {
      const updatedItems = [...prevData.items];
      updatedItems[idx] = {
        ...updatedItems[idx],
        completed: !updatedItems[idx].completed,
      };

      return {
        ...prevData,
        items: updatedItems,
      };
    });
    setIsUpdated(true);
  };

  const handleRemoveMember = (event) => {
    if (!isAuthor) return;

    const removedMember = event.currentTarget.dataset.fullName;

    const members = formData.members.filter(
      (member) => member !== removedMember,
    );

    setFormData({
      ...formData,
      members: members,
    });
    setIsUpdated(true);
  };

  const handleDeleteList = () => {
    handleModalState("deleteList");

    //TODO: API - delete list

    navigate("/");
  };

  const handleSaveList = () => {
    handleModalState("saveList");

    axios
      .post(`/lists/${listId}/edit`, _.omitBy(formData, _.isEmpty))
      .then(() => {
        navigate("/");
      });
  };

  const handleArchiveList = () => {
    handleModalState("archiveList");

    axios
      .post(`/lists/${listId}/archive`, _.omitBy(formData, _.isEmpty))
      .then(() => {
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

  modalProps.archiveList = {
    ...modalProps.archiveList,
    func: { onClose: handleModalState, onAccept: handleArchiveList },
    isOpen: modalOpen.archiveList,
  };

  modalProps.deleteList = {
    ...modalProps.deleteList,
    func: { onClose: handleModalState, onAccept: handleDeleteList },
    isOpen: modalOpen.deleteList,
  };

  modalProps.leaveList = {
    ...modalProps.leaveList,
    func: { onClose: handleModalState, onAccept: handleSaveList },
    isOpen: modalOpen.leaveList,
  };

  modalProps.leavePage = {
    ...modalProps.leavePage,
    func: {
      onClose: handleModalState,
      onAccept: () => {
        navigate("/");
      },
    },
    isOpen: modalOpen.leavePage,
  };

  modalProps.newListMember = {
    isOpen: modalOpen.newListMember,
    listData: formData,
    setListData: setFormData,
    handleState: handleModalState,
    setIsUpdated: setIsUpdated,
  };

  return (
    <section className={"flex w-full h-full pl-8"}>
      <FormControl className={"flex w-full h-full"}>
        <header className={"flex justify-between w-full relative"}>
          <button
            className={"absolute  -left-12"}
            onClick={() => {
              if (isUpdated) {
                handleModalState("leavePage");
              } else {
                navigate("/");
              }
            }}
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
            onChange={({ target }) => {
              setFormData({
                ...formData,
                listName: target.value,
              });
              setIsUpdated(true);
            }}
            disabled={!isAuthor}
          />
          <div className={"flex gap-4"}>
            <button>
              <RemoveCircleOutlineIcon
                fontSize={"large"}
                color={"error"}
                onClick={() => {
                  isAuthor
                    ? handleModalState("deleteList")
                    : handleModalState("leaveList");
                }}
              />
            </button>
            <button>
              <SaveIcon
                fontSize={"large"}
                onClick={() => handleModalState("saveList")}
              />
            </button>
            <button className={!isAuthor ? "hidden" : ""}>
              <ArchiveIcon
                fontSize={"large"}
                onClick={() => handleModalState("archiveList")}
              />
            </button>
          </div>
        </header>
        <div className={"w-full mt-12 mb-16"}>
          <h1 className={"text-lg pb-1 border-b border-gray-400 mb-3"}>
            Členové
          </h1>
          <div className={"flex gap-2 flex-wrap"}>
            {formData.members.map((member, idx) => (
              <Chip
                data-full-name={member}
                key={idx}
                label={member}
                onDelete={
                  isAuthor && isHovered === idx ? handleRemoveMember : null
                }
                onClick={handleRemoveMember}
                onMouseOver={() => setIsHovered(idx)}
                onMouseOut={() => setIsHovered(null)}
              />
            ))}
            <Chip
              sx={{
                display: !isAuthor ? "none" : "inherit",
              }}
              label={"Přidat"}
              onClick={() => handleModalState("newListMember")}
              onDelete={() => handleModalState("newListMember")}
              deleteIcon={<AddCircleRoundedIcon />}
            />
          </div>
        </div>
        <div className={"w-full my-4"}>
          <div className={"flex border-b border-gray-400 mb-3 items-baseline"}>
            <div>
              <h1 className={"text-lg mr-4"}>Položky</h1>
            </div>
            <div className={"text-sm"}>
              Pouze Aktivní
              <Switch
                checked={!disableCompleted}
                onChange={() => setDisableCompleted(!disableCompleted)}
              />
              Všechny
            </div>
          </div>

          <List>
            {formData.items.map((item, idx) => {
              if (disableCompleted && item.completed) return;
              return (
                <ListItem
                  disablePadding
                  key={idx}
                  onClick={() => handleItemUpdate(idx)}
                >
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
      <BasicModal modalProps={modalProps.archiveList as TModalProps} />
      <BasicModal modalProps={modalProps.deleteList as TModalProps} />
      <BasicModal modalProps={modalProps.leavePage as TModalProps} />
      <BasicModal modalProps={modalProps.leaveList as TModalProps} />
      <NewListMemberModal
        listMemberModalProps={modalProps.newListMember as TListModalProps}
      />
    </section>
  );
};

export default ListDetail;
