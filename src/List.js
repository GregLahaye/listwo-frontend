import AuthContext, { deauthorize } from "./AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Column from "./Column";
import { navigate } from "@reach/router";

const List = ({ listId }) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [list, setList] = useState({});
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleDeleteColumn = (id) => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    const form = new FormData();
    form.append("id", id);

    fetch(`${process.env.API_URL}/columns`, {
      method: "DELETE",
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
        setColumns(columns.filter((column) => column.id != data));
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

  const handleAddColumn = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    const form = new FormData();
    form.append("list", listId);
    form.append("title", title);

    fetch(`${process.env.API_URL}/columns`, {
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
        setColumns([...columns, data]);
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

    setTitle("");
  };

  const fetchList = () => {
    const url = new URL(`${process.env.API_URL}/list`);
    url.searchParams.set("list", listId);

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    fetch(url, {
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
        setList(data);
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

  const fetchColumns = () => {
    const url = new URL(`${process.env.API_URL}/columns`);
    url.searchParams.set("list", listId);

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    fetch(url, {
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
        setColumns(data || []);
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

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/signin");
      return;
    }

    fetchList();
    fetchColumns();
  }, [auth.id, listId]);

  return (
    <div>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : loading ? (
        <p>Loading</p>
      ) : (
        <main role="main" className="container">
          <div className="d-flex justify-content-between">
            <h1>{list.title}</h1>
            <form className="form-inline" onSubmit={handleAddColumn}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="column-title"
                  placeholder="My new column"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add column
              </button>
            </form>
          </div>
          <div className="card-deck text-center justify-content-center">
            {columns && columns.length
              ? columns.map((column) => (
                  <Column
                    {...column}
                    handleDeleteColumn={handleDeleteColumn}
                    key={column.id}
                  />
                ))
              : null}
          </div>
        </main>
      )}
    </div>
  );
};

export default List;
