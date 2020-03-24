import AuthContext, {
  deauthorize,
  isAuthenticated,
  request,
} from "./AuthContext";
import { Link, navigate } from "@reach/router";
import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const Lists = () => {
  const [auth, setAuth] = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listTitle, setListTitle] = useState("");
  const [error, setError] = useState("");

  const fetchLists = () => {
    if (!isAuthenticated(auth)) {
      deauthorize(setAuth);
      return;
    }

    request("GET", "lists", { auth })
      .then((data) => {
        setLists(data || []);
        setLoading(false);
      })
      .catch((err) => {
        switch (err.status) {
          case 401:
            deauthorize(setAuth);
            break;

          case 403:
            setError("You don't have permission to access this resource");
            break;

          default:
            setError("Unknown Error");
            break;
        }

        setLoading(false);
      });
  };

  const handleAddList = (e) => {
    e.preventDefault();

    const title = listTitle.trim();

    if (!title.trim()) return;

    request("POST", "lists", { form: { title }, auth })
      .then((data) => {
        setLists([...lists, data]);

        navigate(`/lists/${data.id}`);
      })
      .catch((err) => {
        switch (err.status) {
          case 401:
            deauthorize(setAuth);
            break;

          case 403:
            setError("You don't have permission to access this resource");
            break;

          default:
            setError("Unknown Error");
            break;
        }
      });

    setListTitle("");
  };

  const handleDeleteList = (id) => {
    if (!confirm("Are you sure?")) return;

    request("DELETE", "lists", { form: { id }, auth })
      .then((data) => {
        setLists(lists.filter(({ id }) => id !== data));
      })
      .catch((err) => {
        switch (err.status) {
          case 401:
            deauthorize(setAuth);
            break;

          case 403:
            setError("You don't have permission to access this resource");
            break;

          default:
            setError("Unknown Error");
            break;
        }
      });
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : loading ? (
        <ul className="list-group">
          <li className="list-group-item" style={{ height: 64 }}>
            <Skeleton />
          </li>
          <li className="list-group-item" style={{ height: 64 }}>
            <Skeleton />
          </li>
          <li className="list-group-item" style={{ height: 64 }}>
            <Skeleton />
          </li>
        </ul>
      ) : (
        <ul className="list-group">
          {lists.length
            ? lists.map((list) => (
                <li className="list-group-item" key={list.id}>
                  <Link to={list.id} className="btn btn-link">
                    {list.title}
                  </Link>
                  <button
                    className="btn btn-sm btn-danger float-right"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            : null}
          <li className="list-group-item">
            <form onSubmit={handleAddList}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="list-title"
                  placeholder="My new list"
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add list
              </button>
            </form>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Lists;
