import React, { SetStateAction } from "react";

export type TModal =
  | "deleteList"
  | "archiveList"
  | "leaveList"
  | "newListMember"
  | "saveList"
  | "leavePage";

export type TModalProps = {
  isOpen: boolean;
  type: TModal;
  func: {
    onClose: (modal: TModal) => void;
    onAccept: (value?: string) => void;
  };
  ctaButton: {
    color: "primary" | "error";
    text: string;
  };
  text: {
    headline: string;
    body: string;
  };
};

export type TListModalProps = {
  isOpen: boolean;
  listData: TList;
  setListData: React.Dispatch<SetStateAction<TList>>;
  handleState: React.Dispatch<SetStateAction<TModal>>;
  setIsUpdated: React.Dispatch<SetStateAction<boolean>>;
};

export type TList = {
  listName: string;
  author: string;
  items: TListItem[];
  members: string[];
  dateCreated: string;
  archived: boolean;
};

export type TListItem = {
  itemName: string;
  completed: boolean;
};

export type TUser = {
  fullName: string;
  username: string;
};
