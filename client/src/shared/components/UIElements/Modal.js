import Map from "../../../place/components/Map";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    lg: "50%",
    md: "65%",
    xs: "85%",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 1,
};

const ModalMap = (props) => {
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.toggleHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Map center={props.coordinates} zoom={16} />
        </Box>
      </Modal>
    </>
  );
};
export default ModalMap;
