import "./index.css";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import { data } from "autoprefixer";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7a5ed4fa-651f-4308-b8f7-95d38182702d",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, users]) => {
    avatar.src = users.avatar;
    console.log(users);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editModalFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editForm = editModal.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");

const avatar = document.querySelector(".profile__avatar");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__submit-cancel");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

let selectedCard;
let selectedCardId;

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("mousedown", handleCloseOverlay);
  document.addEventListener("keydown", handleEscKeyPress);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("mousedown", handleCloseOverlay);
  document.removeEventListener("keydown", handleEscKeyPress);
}

function handleCloseOverlay(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleEscKeyPress(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.disabled = true;
  setButtonText(submitBtn, true);
  api
    .getNewCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch((err) => {
      console.error(err);
      submitBtn.disabled = false;
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  api
    .likeStatus(id, isLiked)
    .then((data) => {
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Deleting...", "Delete");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Deleting...", "Delete");
      submitBtn.disabled = false;
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatar.src = data.avatar;
      avatar.alt = `${data.name}'s avatar`;
      avatarForm.reset();
      disableButton(avatarSubmitBtn, settings);
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error(err);
      submitBtn.disabled = false;
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  if (data && data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_liked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardDeleteBtn.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
    // cardElement.remove();
    // closeModal(cardModal);
  });
  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

  resetValidation(
    editForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editModalFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
enableValidation(settings);
