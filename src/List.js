import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import Column from "./Column";
import { navigate } from "@reach/router";

const List = ({ listId }) => {
  const [auth] = useContext(AuthContext);
  const [list, setList] = useState({});
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      .catch(() => {
        setError("Unknown Error");
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
        setColumns(data);
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
          <h1>{list.title}</h1>
          {columns && columns.length ? (
            columns.map((column) => <Column {...column} key={column.id} />)
          ) : (
            <p>No columns</p>
          )}
        </main>
      )}
    </div>
  );
};

export default List;
