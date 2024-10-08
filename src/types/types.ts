import React from "react";

export type TModal =
  | "deleteList"
  | "archiveList"
  | "leaveList"
  | "newListMember";

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
