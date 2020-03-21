import { Link, navigate } from "@reach/router";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const Lists = () => {
  const [auth] = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleAddList = (e) => {
    e.preventDefault();

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    const form = new FormData();
    form.append("title", title);

    fetch("http://localhost:8080/lists", {
      method: "POST",
      headers,
      body: form,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw response;
      })
      .then((data) => {
        setLists([...lists, data]);
      })
      .catch(() => {
        setError("Unknown Error");
      });

    setTitle("");
  };

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/signin");
      return;
    }

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    fetch("http://localhost:8080/lists", {
      method: "GET",
      headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw response;
      })
      .then((data) => {
        setLists(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unknown Error");
        setLoading(false);
      });
  }, [auth.id]);

  return (
    <div>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : loading ? (
        <p>Loading</p>
      ) : (
        <ul className="list-group">
          {lists.length ? (
            lists.map((list) => (
              <li className="list-group-item" key={list.id}>
                <Link to={list.id}>{list.title}</Link>
              </li>
            ))
          ) : (
            <p>No lists</p>
          )}
          <li className="list-group-item">
            <form onSubmit={handleAddList}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="list-title"
                  placeholder="My new list"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
