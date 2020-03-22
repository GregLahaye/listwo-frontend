import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import Column from "./Column";
import { navigate } from "@reach/router";

const List = ({ listId }) => {
  const [auth] = useContext(AuthContext);
  const [list, setList] = useState({});
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleAddColumn = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    const form = new FormData();
    form.append("list", listId);
    form.append("title", title);

    fetch("http://localhost:8080/columns", {
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
            deauthorize();
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
    const url = new URL("http://localhost:8080/list");
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
            deauthorize();
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
    const url = new URL("http://localhost:8080/columns");
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
      .catch(() => {
        setError("Unknown Error");
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
                Add list
              </button>
            </form>
          </div>
          <div className="card-deck text-center justify-content-center">
            {columns && columns.length ? (
              columns.map((column) => <Column {...column} key={column.id} />)
            ) : (
              <p>No columns</p>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default List;
