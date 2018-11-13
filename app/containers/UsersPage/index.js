import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import uuid from 'uuid';
import { makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import UsersTable from 'components/UsersTable';
import {
  loadUsers as actionLoadUsers,
  deleteUser as actionDeleteUser,
  addUser as actionAddUser,
} from './actions';
import { makeSelectUsers } from './selectors';

export class UsersPage extends React.PureComponent {
  state = {
    id: '',
    name: '',
    email: '',
    phone: '',
  };
  // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    const { loading, error, loadUsers, users } = this.props;
    if (!loading && !error && users === false) {
      loadUsers();
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone } = this.state;

    const newUser = {
      id: uuid(),
      name,
      email,
      phone,
    };

    this.props.addUser(newUser);

    // Clear State
    this.setState({
      id: '',
      name: '',
      email: '',
      phone: '',
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { loading, error, users, loadUsers, deleteUser, addUser } = this.props;
    const usersTableProps = { loading, error, users, deleteUser };
    const { name, email, phone } = this.state;

    // console.log(users);

    return (
      <div>
        <Helmet title="Users" meta={[{ name: 'description', content: 'Users List' }]} />

        <div className="mb-3">
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="examplePassword">Name</Label>
              <Input
                type="text"
                name="name"
                id="examplePassword"
                placeholder="name placeholder"
                value={name}
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="with a placeholder"
                value={email}
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Phone</Label>
              <Input
                type="text"
                name="phone"
                id="examplePassword"
                placeholder="name placeholder"
                value={phone}
                onChange={this.onChange}
              />
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </div>
        <div className="d-flex flex-row-reverse mb-3">
          {/* <Button color="secondary" onClick={addUser}> */}
          <Button color="secondary" onClick={loadUsers}>
            <i className="fa fa-refresh" />
          </Button>
        </div>

        <UsersTable {...usersTableProps} />
      </div>
    );
  }
}

UsersPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  users: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  loadUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
};

export function mapStateToProps(state) {
  return {
    loading: makeSelectLoading()(state),
    error: makeSelectError()(state),
    users: makeSelectUsers()(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadUsers: () => dispatch(actionLoadUsers()),
    deleteUser: (user) => dispatch(actionDeleteUser(user)),
    addUser: (user) => dispatch(actionAddUser(user)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersPage);
