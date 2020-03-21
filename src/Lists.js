import { Link, navigate } from "@reach/router";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const Lists = () => {
  const [auth] = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      ) : lists.length ? (
        <ul className="list-group">
          {lists.map((list) => (
            <li className="list-group-item" key={list.id}>
              <Link to={list.id}>{list.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No lists</p>
      )}
    </div>
  );
};

export default Lists;
