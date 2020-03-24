import AuthContext, {
  deauthorize,
  isAuthenticated,
  request,
} from "./AuthContext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useContext, useEffect, useState } from "react";
import Editable from "./Editable";
import Skeleton from "react-loading-skeleton";

const Column = ({ id: columnId, title: initialTitle, handleDeleteColumn }) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [columnTitle, setColumnTitle] = useState(initialTitle);
  const [itemTitle, setItemTitle] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = () => {
    if (!isAuthenticated(auth)) {
      deauthorize(setAuth);
      return;
    }

    request("GET", "items", { params: { column: columnId }, auth })
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
  };

  const handleUpdateColumn = () => {
    request("PATCH", "columns", {
      params: { id: columnId, title: columnTitle },
      auth,
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    const title = itemTitle.trim();

    if (!title) return;

    request("POST", "items", { form: { column: columnId, title }, auth })
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

  const handleDeleteItem = (id) => {
    request("DELETE", "items", { form: { id }, auth })
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

    request("PATCH", "items", { params: { id, dst }, auth });
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const id = result.draggableId;

    reorder(id, result.source.index, result.destination.index);
  };

  useEffect(() => {
    fetchItems();
  }, [columnId]);

  return (
    <div className="col-md w-100 py-3" style={{ width: 280 }}>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="card">
          <div className="card-header d-flex align-items-center">
            <Editable
              name="title"
              placeholder="Column title"
              value={columnTitle}
              setValue={setColumnTitle}
              updateValue={handleUpdateColumn}
              fontSize={18}
            />
            <button
              className="btn btn-sm btn-secondary ml-auto"
              onClick={() => handleDeleteColumn(columnId)}
            >
              Delete
            </button>
          </div>
          <ul className="list-group list-group-flush">
            {loading ? (
              <div>
                <li className="list-group-item" style={{ height: 63 }}>
                  <Skeleton />
                </li>
                <li className="list-group-item" style={{ height: 49 }}>
                  <Skeleton />
                </li>
                <li className="list-group-item" style={{ height: 49 }}>
                  <Skeleton />
                </li>
                <li className="list-group-item" style={{ height: 49 }}>
                  <Skeleton />
                </li>
                <li className="list-group-item" style={{ height: 49 }}>
                  <Skeleton />
                </li>
              </div>
            ) : items && items.length ? (
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
                                    type="button"
                                    className="close float-right"
                                    aria-label="Close"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <span aria-hidden="true">&times;</span>
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
            ) : null}
          </ul>
          <div className="card-footer">
            <div className="row">
              <form
                className="form-inline w-100 justify-content-center"
                onSubmit={handleAddItem}
              >
                <div className="col-8 px-0">
                  <input
                    type="text"
                    className="form-control w-100"
                    id={`${columnId}-item-title`}
                    placeholder="My new item"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                  />
                </div>
                <div className="col-4 px-0 text-center">
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
