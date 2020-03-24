import AuthContext, {
  deauthorize,
  isAuthenticated,
  request,
} from "./AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Column from "./Column";
import Editable from "./Editable";
import Skeleton from "react-loading-skeleton";

const List = ({ listId }) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [list, setList] = useState({});
  const [columns, setColumns] = useState([]);
  const [columnTitle, setColumnTitle] = useState("");
  const [error, setError] = useState("");

  const updateListTitle = () => {
    request("PATCH", "lists", {
      params: { id: listId, title: list.title },
      auth,
    });
  };

  const fetchList = () => {
    request("GET", "list", { params: { id: listId }, auth })
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
    request("GET", "columns", { params: { list: listId }, auth })
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

  const handleAddColumn = (e) => {
    e.preventDefault();

    const title = columnTitle.trim();

    if (!title.trim()) return;

    const id = String(Date.now());
    const pending = true;

    setColumns([...columns, { id, title, pending }]);

    request("POST", "columns", { form: { list: listId, title }, auth })
      .then((data) => {
        setColumns((columns) => [
          ...columns.filter((column) => column.id !== id),
          { ...data, fresh: true },
        ]);
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

  const handleDeleteColumn = (id) => {
    const deleted = columns.find((column) => column.id === id);

    if (deleted.pending) return;

    if (!confirm("Are you sure?")) return;

    setColumns(columns.filter((column) => column.id !== id));

    request("DELETE", "columns", { form: { id }, auth }).catch((err) => {
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
    if (!isAuthenticated(auth)) {
      deauthorize(setAuth);
      return;
    }

    fetchList();
    fetchColumns();
  }, [listId]);

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
                  updateValue={updateListTitle}
                  fontSize={24}
                />
              ) : (
                <Skeleton height={46} />
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
