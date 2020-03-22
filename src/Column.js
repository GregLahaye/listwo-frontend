import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { navigate } from "@reach/router";

const Column = ({ id: columnId, title }) => {
  const [auth] = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemTitle, setItemTitle] = useState("");
  const [error, setError] = useState("");

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!itemTitle.trim()) return;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${auth.accessToken}`);

    const form = new FormData();
    form.append("column", columnId);
    form.append("title", itemTitle);

    fetch("http://localhost:8080/items", {
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
      .catch(() => {
        setError("Unknown Error");
      });

    setItemTitle("");
  };

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/signin");
      return;
    }

    const url = new URL("http://localhost:8080/items");
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
      .catch(() => {
        setError("Unknown Error");
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

    const url = new URL("http://localhost:8080/items");
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
          <h5 className="card-header">{title}</h5>
          {items && items.length ? (
            <ul className="list-group">
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
                                {+item.position ? (
                                  item.title
                                ) : (
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => handleClick(item.id)}
                                  >
                                    {item.title}
                                  </button>
                                )}
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
