import { render, remove, RenderPosition } from '../framework/render.js';
import PointView from '../view/point-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointNewPresenter {
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;
  #pointListContainer = null;
  #creatingPointComponent = null;
  #changeData = null;
  #destroyCallback = null;

  constructor({pointListContainer, changeData, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#creatingPointComponent !== null) {
      return;
    }
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#creatingPointComponent = new PointView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });
    this.#creatingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#creatingPointComponent.setResetClickHandler(this.#handleResetClick);

    render(this.#creatingPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#creatingPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#creatingPointComponent);
    this.#creatingPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#creatingPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    this.#creatingPointComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#creatingPointComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.CREATE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
