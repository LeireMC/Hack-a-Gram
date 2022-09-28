import { useState, useRef } from "react";
import { toast } from "react-toastify";
import Avatar from "../Avatar";
import { useNavigate } from "react-router-dom";

const EditProfileForm = ({ token, loggedUser }) => {
  const navigate = useNavigate();

  const {
    id,
    name: currentName,
    lastname: currentLastname,
    bio: currentBio,
    url: currentUrl,
    privacy: currentPrivacy,
    avatar: currentAvatar,
    username: currentUsername,
    email: currentEmail,
  } = loggedUser[0];

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPrivacy, setNewPrivacy] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newName, setNewName] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newAvatarPreview, setNewAvatarPreview] = useState("");

  console.log(newPrivacy);
  const newAvatarRef = useRef();

  return (
    <form
      onSubmit={async (event) => {
        try {
          event.preventDefault();

          const file = newAvatarRef.current.files[0];

          if (
            !(
              newUsername ||
              newEmail ||
              file ||
              newPass ||
              newName ||
              newLastname ||
              newBio ||
              newUrl ||
              newPrivacy
            )
          ) {
            toast.warn("No has introducido ningún dato nuevo");
            return;
          }
          const formData = new FormData();
          if (newUsername) {
            formData.append("username", newUsername);
          }
          if (newEmail) {
            formData.append("email", newEmail);
          }
          if (file) {
            formData.append("avatar", file);
          }
          if (newPass) {
            formData.append("newPass", newPass);
          }
          if (oldPass) {
            formData.append("oldPass", oldPass);
          }
          if (newName) {
            formData.append("name", newName);
          }
          if (newLastname) {
            formData.append("lastname", newLastname);
          }
          if (newBio) {
            formData.append("bio", newBio);
          }
          if (newUrl) {
            formData.append("url", newUrl);
          }
          if (newPrivacy) {
            formData.append("privacy", newPrivacy);
          }
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/user/data`,
            {
              method: "PUT",
              headers: {
                Authorization: token,
              },
              body: formData,
            }
          );
          if (!res.ok) {
            const body = await res.json();
            throw new Error(body.message);
          }
          toast.success("Perfil de Hack a Gram actualizado con éxito");
          navigate(`/profile/${id}`);
        } catch (error) {
          console.error(error.message);
          toast.error(error.message);
        }
      }}
    >
      <label htmlFor="avatar">
        {!newAvatarPreview && (
          <Avatar avatar={currentAvatar} username={currentUsername} />
        )}

        {newAvatarPreview && (
          <img src={newAvatarPreview} alt={currentUsername} />
        )}
      </label>
      <input
        id="avatar"
        type="file"
        hidden
        ref={newAvatarRef}
        onChange={() => {
          const file = newAvatarRef.current.files[0];

          setNewAvatarPreview(URL.createObjectURL(file));
        }}
      />

      <label htmlFor="username">Nombre de usuario:</label>
      <input
        id="username"
        value={newUsername}
        onChange={(event) => {
          setNewUsername(event.target.value);
        }}
        placeholder={currentUsername}
      />

      <label htmlFor="email">Email:</label>
      <input
        id="email"
        value={newEmail}
        onChange={(event) => {
          setNewEmail(event.target.value);
        }}
        placeholder={currentEmail}
      />

      <label htmlFor="name">Nombre:</label>
      <input
        id="name"
        value={newName}
        onChange={(event) => {
          setNewName(event.target.value);
        }}
        placeholder={currentName}
      />

      <label htmlFor="lastname">Apellido/Apellidos:</label>
      <input
        id="lastname"
        value={newLastname}
        onChange={(event) => {
          setNewLastname(event.target.value);
        }}
        placeholder={currentLastname}
      />

      <label htmlFor="bio">Bio:</label>
      <input
        id="bio"
        value={newBio}
        onChange={(event) => {
          setNewBio(event.target.value);
        }}
        placeholder={currentBio}
      />

      <label htmlFor="url">URL:</label>
      <input
        id="url"
        value={newUrl}
        onChange={(event) => {
          setNewUrl(event.target.value);
        }}
        placeholder={currentUrl}
      />

      <label htmlFor="oldPass">Password anterior:</label>
      <input
        id="oldPass"
        value={newPass}
        onChange={(event) => {
          setOldPass(event.target.value);
        }}
      />

      <label htmlFor="newPass">Password nuevo:</label>
      <input
        id="newPass"
        value={newPass}
        onChange={(event) => {
          setNewPass(event.target.value);
        }}
      />

      <p>Privacidad:</p>
      <input
        type="radio"
        id="public"
        value="public"
        name="privacy"
        checked={"public" === currentPrivacy}
        onChange={(event) => {
          setNewPrivacy(event.target.value);
        }}
      />
      <label htmlFor="public">Público</label>
      <input
        type="radio"
        id="private"
        value="private"
        name="privacy"
        checked={"private" === currentPrivacy}
        onChange={(event) => {
          setNewPrivacy(event.target.value);
        }}
      />
      <label htmlFor="private">Privado</label>

      <button>Actualizar perfil</button>
    </form>
  );
};

export default EditProfileForm;
