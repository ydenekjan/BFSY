import {
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import { TModalProps } from "../../utils/types/types.ts";

const BasicModal = ({ modalProps }: { modalProps: TModalProps }) => {
  const { isOpen, type, func, ctaButton, text }: TModalProps = modalProps;

  return (
    <Modal open={isOpen} onClose={() => func.onClose(type)}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: 1,
            alignItems: "center",
            bgcolor: grey[200],
            px: 3,
            py: 2,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
          }}
        >
          <Typography variant="h6" component="h2">
            {text.headline}
          </Typography>
          <IconButton onClick={() => func.onClose(type)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography sx={{ display: "flex", py: 2, px: 3 }}>
          {text.body}
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            px: 3,
            py: 2,
          }}
        >
          <Button
            sx={{
              color: grey[800],
              borderColor: grey[800],
            }}
            variant={"outlined"}
            onClick={() => func.onClose(type)}
          >
            Zrušit
          </Button>
          <Button
            color={ctaButton.color}
            variant={"contained"}
            onClick={() => func.onAccept()}
          >
            {ctaButton.text}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BasicModal;
