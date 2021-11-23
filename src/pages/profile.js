import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import PageTemplate from "../component/global/PageTemplate";
import {
  nameValidator,
  passwordValidator,
  phoneValidator,
} from "../component/utils/utils";
import userContext from "../state/user/userContext";
import MyOutlinedInput from "../component/global/MyOutlinedInput";

const Profile = ({ location }) => {
  const { user, editUser, changePassword } = React.useContext(userContext);

  const oldName = user.name;
  const oldPhone = user.user ? user.user.phone : "";
  const email = user.email;

  const [formValues, setformValues] = React.useState({
    name: oldName,
    phone: oldPhone,
  });

  const [savingProfile, setSavingProfile] = React.useState(false);
  const [changingPassword, setChangingPassword] = React.useState(false);

  React.useEffect(() => {
    setformValues({
      name: user.name,
      phone: user.user ? user.user.phone : "",
    });
  }, [user, setformValues]);

  const [passValues, setPassValues] = React.useState({
    oldPass: "",
    newPass: "",
  });

  const handleChange1 = (event) => {
    setformValues({
      ...formValues,
      [`${event.target.id}`]: event.target.value,
    });
  };

  const handleChange2 = (event) => {
    setPassValues({
      ...passValues,
      [`${event.target.id}`]: event.target.value,
    });
  };

  const canSave1 =
    !savingProfile &&
    !nameValidator(formValues.name) &&
    !phoneValidator(formValues.phone) &&
    (formValues.name.toLowerCase() !== oldName.toLowerCase() ||
      formValues.phone !== oldPhone);

  const canSave2 =
    !changingPassword &&
    !passwordValidator(passValues.oldPass) &&
    !passwordValidator(passValues.newPass);

  const handleClick = async () => {
    setChangingPassword(true);
    const valid = await changePassword({
      old_pass: passValues.oldPass,
      new_pass: passValues.newPass,
    });
    valid &&
      setPassValues({
        oldPass: "",
        newPass: "",
      });
    setChangingPassword(false);
  };

  return (
    <PageTemplate location={location} title="Profile">
      <Toolbar />
      <Container maxWidth="sm">
        <Stack component="form" spacing={2} direction="column" py={4}>
          <Typography variant="h3" color="text.primary" gutterBottom>
            Edit Profile
          </Typography>
          <MyOutlinedInput
            id="name"
            label="Name"
            variant="outlined"
            autoComplete="off"
            value={formValues.name || ""}
            onChange={handleChange1}
          />
          <MyOutlinedInput
            id="phone"
            label="Phone"
            variant="outlined"
            autoComplete="off"
            value={formValues.phone || ""}
            onChange={handleChange1}
          />
          <MyOutlinedInput
            id="email"
            label="Email"
            variant="outlined"
            autoComplete="off"
            value={email || ""}
            disabled
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "capitalize" }}
              disabled={!canSave1}
              onClick={async () => {
                setSavingProfile(true);
                await editUser(formValues);
                setSavingProfile(false);
              }}
            >
              {savingProfile ? <CircularProgress size={25} /> : "Save"}
            </Button>
          </Stack>
        </Stack>
        <Divider light />
        <Stack component="form" spacing={2} direction="column" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Change password
          </Typography>
          <MyOutlinedInput
            id="oldPass"
            label="Old password"
            variant="outlined"
            autoComplete="off"
            type="password"
            value={passValues.oldPass}
            onChange={handleChange2}
          />
          <MyOutlinedInput
            id="newPass"
            label="New password"
            variant="outlined"
            autoComplete="off"
            type="password"
            value={passValues.newPass}
            onChange={handleChange2}
          />
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "capitalize" }}
              disabled={!canSave2}
              onClick={handleClick}
            >
              {changingPassword ? <CircularProgress size={25} /> : "Change"}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </PageTemplate>
  );
};

export default Profile;
