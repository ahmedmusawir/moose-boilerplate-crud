/**
 * User
 *
 * Shows a single user.
 */

import React from 'react';
import { Link } from 'react-router';
import { Button } from 'reactstrap';

const UserRow = ({ user, deleteUser }) => (
  <tr>
    <td>{user.id}</td>
    <td>
      <Link to={`/user/${user.id}`}>{user.name}</Link>
    </td>
    <td>{user.email}</td>
    <td>{user.address}</td>
    <td>{user.phone}</td>
    <td>
      <Button color="secondary" onClick={() => deleteUser(user)}>
        <i className="fa fa-trash" />
      </Button>
    </td>
  </tr>
);
UserRow.propTypes = {
  user: React.PropTypes.object.isRequired,
  deleteUser: React.PropTypes.func.isRequired,
};

export default UserRow;
