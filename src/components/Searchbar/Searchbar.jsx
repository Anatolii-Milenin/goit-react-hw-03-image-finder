import React, { Component } from 'react';
import { toast } from 'react-hot-toast';
import { BiSearch } from 'react-icons/bi';
import css from './Searchbar.module.css';

export class Searchbar extends Component {
  state = {
    search: '',
  };

  onChangeInput = evt => {
    const { name, value } = evt.target;
    this.setState({ [name]: value });
  };

  handleSubmit = evt => {
    evt.preventDefault();
    if (!this.state.search) {
      return toast.error('Enter text for search.');
    }
    this.props.handleSubmit(this.state.search);
    this.resetForm();
  };

  resetForm = () => {
    this.setState({ search: '' });
  };

  render() {
    return (
      <header className={css.searchbar}>
        <form onSubmit={this.handleSubmit} className={css.Form}>
          <button type="submit" className={css.Button}>
            <BiSearch size="20" />
          </button>
          <input
            value={this.state.search}
            onChange={this.onChangeInput}
            className={css.Input}
            name="search"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </form>
      </header>
    );
  }
}
