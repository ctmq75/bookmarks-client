import React, { Component } from "react";
import PropTypes from "prop-types";
import BookmarksContext from "../BookmarksContext";
import config from "../config";
import "./EditBookmark.css";

const Required = () => <span className="EditBookmark__required">*</span>;

class EditBookmark extends Component {
  static contextType = BookmarksContext;

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  state = {
    error: null,
    id: "",
    title: "",
    url: "",
    description: "",
    rating: 1,
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();

        return res.json().then((error) => Promise.reject(error));
      })
      .then((data) => {
        this.setState({
          id: data.id,
          title: data.title,
          url: data.url,
          description: data.description,
          rating: data.rating,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }
  // event handlers
  handleChangeTitle = (err) => {
    this.setState({ title: err.target.value });
  };
  handleChangeRating = (err) => {
    this.setState({ rating: err.target.value });
  };
  handleChangeUrl = (err) => {
    this.setState({ url: err.target.value });
  };
  handleChangeDescription = (err) => {
    this.setState({ description: err.target.value });
  };
  handleSubmit = (err) => {
    err.preventDefault();
    const { bookmarkId } = this.props.match.params;
    const { id, title, url, description, rating } = this.state;
    const newBookmark = { id, title, url, description, rating };
    //make patch request
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: "PATCH",
      body: JSON.stringify(newBookmark),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((error) => Promise.reject(error));
      })
      .then(() => {
        this.resetFields(newBookmark);
        this.context.updateBookmark(newBookmark);
        this.props.history.push("/");
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || "",
      title: newFields.title || "",
      url: newFields.url || "",
      description: newFields.description || "",
      rating: newFields.rating || "",
    });
  };

  handleClickCancel = () => {
    this.props.history.push("/");
  };

  render() {
    const { error, title, url, description, rating } = this.state;
    return (
      <section className="EditBookmark">
        <h2>Edit bookmark</h2>
        <form className="EditBookmark__form" onSubmit={this.handleSubmit}>
          <div className="EditBookmark__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <input type="hidden" name="id" />
          <div>
            <label htmlFor="title">
              Title <Required />
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Great website!"
              required
              value={title}
              onChange={this.handleChangeTitle}
            />
          </div>
          <div>
            <label htmlFor="url">
              URL <Required />
            </label>
            <input
              type="url"
              name="url"
              id="url"
              placeholder="https://www.sample.com/"
              required
              value={url}
              onChange={this.handleChangeUrl}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor="rating">
              Rating <Required />
            </label>
            <input
              type="number"
              name="rating"
              id="rating"
              min="1"
              max="5"
              required
              value={rating}
              onChange={this.handleChangeRating}
            />
          </div>
          <div className="EditBookmark__buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{" "}
            <button type="submit" >Save</button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
