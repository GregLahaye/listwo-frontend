import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { navigate } from "@reach/router";

const Column = ({ id: columnId, title }) => {
  const [auth] = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unknown Error");
      });
  }, [auth.id, columnId]);

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
          <div className="card">
            <div className="card-header">{title}</div>
            <div className="card-body">
              <ul className="list-group">
                {items.map((item) => (
                  <li key={item.id} className="list-group-item">
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Column;
