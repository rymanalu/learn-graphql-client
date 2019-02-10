import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

import { addBookMutation, getAuthorsQuery, getBooksQuery } from '../queries/queries'

class AddBook extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name: '',
      genre: '',
      authorId: ''
    };
  }

  displayAuthors() {
    const { getAuthorsQuery } = this.props;

    if (getAuthorsQuery.loading) {
      return <option>Loading authors...</option>;
    }

    return getAuthorsQuery.authors.map(({ id, name }) => <option value={id} key={id}>{name}</option>);
  }

  submitForm(e) {
    e.preventDefault();

    this.props.addBookMutation({
      variables: {
        name: this.state.name,
        genre: this.state.genre,
        authorId: this.state.authorId
      },
      refetchQueries: [{ query: getBooksQuery }]
    })
  }

  render() {
    return (
      <form id="add-book" onSubmit={this.submitForm.bind(this)}>
        <div className="field">
          <label>Book name:</label>
          <input type="text" onChange={e => {this.setState({ name: e.target.value })}} />
        </div>

        <div className="field">
          <label>Genre:</label>
          <input type="text" onChange={e => {this.setState({ genre: e.target.value })}} />
        </div>

        <div className="field">
          <label>Author:</label>
          <select onChange={e => {this.setState({ authorId: e.target.value })}}>
            <option>Select author</option>
            {this.displayAuthors()}
          </select>
        </div>

        <button>+</button>
      </form>
    );
  }
}

export default compose(
  graphql(getAuthorsQuery, { name: 'getAuthorsQuery' }),
  graphql(addBookMutation, { name: 'addBookMutation' })
)(AddBook)
