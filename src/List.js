import AuthContext, { deauthorize } from "./AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Column from "./Column";
import Editable from "./Editable";
import Skeleton from "react-loading-skeleton";
import { navigate } from "@reach/router";

const List = ({ listId }) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [list, setList] = useState({});
  const [columns, setColumns] = useState([]);
  const [columnTitle, setColumnTitle] = useState("");
  const [error, setError] = useState("");

  const updateTitle = () => {
    const url = new URL(`${process.env.API_URL}/lists`);
    url.searchParams.set("id", listId);
    url.searchParams.set("title", list.title);

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    fetch(url, {
      method: "PATCH",
      headers,
    });
  };
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

    if (!columnTitle.trim()) return;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    const form = new FormData();
    form.append("list", listId);
    form.append("title", columnTitle);

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

    setColumnTitle("");
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
      ) : (
        <main role="main" className="container">
          <div className="row justify-content-center pt-3">
            <div className="col-md-8 text-center text-lg-left">
              {list.title ? (
                <Editable
                  name="title"
                  placeholder="List title"
                  value={list.title}
                  setValue={(title) => setList({ ...list, title })}
                  updateValue={updateTitle}
                  fontSize={24}
                />
              ) : (
                <Skeleton width={200} />
              )}
            </div>
            <div className="col-md-auto">
              <form onSubmit={handleAddColumn}>
                <div className="form-row">
                  <div className="col-xs-4">
                    <input
                      type="text"
                      className="form-control"
                      id="column-title"
                      placeholder="My new column"
                      value={columnTitle}
                      onChange={(e) => setColumnTitle(e.target.value)}
                    />
                  </div>
                  <div className="col-auto">
                    <button type="submit" className="btn btn-primary">
                      Add column
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
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
