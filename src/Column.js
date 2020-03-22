import AuthContext, { deauthorize } from "./AuthContext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useContext, useEffect, useState } from "react";
import { navigate } from "@reach/router";

const Column = ({ id: columnId, title, handleDeleteColumn }) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemTitle, setItemTitle] = useState("");
  const [error, setError] = useState("");

  const handleDeleteItem = (id) => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    const form = new FormData();
    form.append("id", id);

    fetch(`${process.env.API_URL}/items`, {
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
        const position = items.find((item) => item.id === data).position;

        let updated = items.filter((item) => item.id != data);

        updated = updated.map((item) => {
          if (item.position >= position) {
            item.position = +item.position - 1;
          }

          return item;
        });

        setItems(updated);
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

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!itemTitle.trim()) return;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    const form = new FormData();
    form.append("column", columnId);
    form.append("title", itemTitle);

    fetch(`${process.env.API_URL}/items`, {
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
        setItems([...items, data]);
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

    setItemTitle("");
  };

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/signin");
      return;
    }

    const url = new URL(`${process.env.API_URL}/items`);
    url.searchParams.set("column", columnId);

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
        setItems(data || []);
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
      });
  }, [auth.id, columnId]);

  const handleClick = (id) => {
    reorder(id, 0, items.length - 1);
  };

  const reorder = (id, src, dst) => {
    const dir = src > dst ? 1 : -1;

    const [lower, upper] = [dir > 0 ? dst : src, dir > 0 ? src : dst];

    const reordered = items.map((item) => {
      if (item.position >= lower && item.position <= upper) {
        item.position = +item.position + dir;
      }

      if (item.id === id) {
        item.position = dst;
      }

      return item;
    });

    setItems(reordered);

    const url = new URL(`${process.env.API_URL}/items`);
    url.searchParams.set("id", id);
    url.searchParams.set("src", src);
    url.searchParams.set("dst", dst);

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    fetch(url, {
      method: "PATCH",
      headers,
    });
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const id = result.draggableId;

    reorder(id, result.source.index, result.destination.index);
  };

  return (
    <div>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : loading ? (
        <p>Loading</p>
      ) : (
        <div className="card">
          <div className="card-header d-flex align-items-center">
            <h5 className="mr-auto">{title}</h5>
            <button
              className="btn btn-secondary"
              onClick={() => handleDeleteColumn(columnId)}
            >
              Delete
            </button>
          </div>
          {items && items.length ? (
            <ul className="list-group list-group-flush">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {items
                        .sort((a, b) => (a.position > b.position ? 1 : -1))
                        .map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                className={
                                  +item.position
                                    ? "list-group-item"
                                    : "list-group-item active"
                                }
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div>
                                  {+item.position ? (
                                    <span>{item.title}</span>
                                  ) : (
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => handleClick(item.id)}
                                    >
                                      {item.title}
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-sm btn-light float-right"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    ✘
                                  </button>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </ul>
          ) : null}
          <div className="card-footer">
            <form onSubmit={handleAddItem}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="item-title"
                  placeholder="My new item"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
