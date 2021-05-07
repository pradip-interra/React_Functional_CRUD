import axios from "axios";

// Create instance called instance
const instance = axios.create({
  baseURL: "http://localhost:5010/api/",
  headers: {
    "content-type": "application/json",
  },
});

function ApiCaller(url) {
  const get = function get() {
    return instance({
      method: "GET",
      url: "/" + url,
      //   params: {
      //     search: "parameter",
      //   },
    });
  };

  const post = function post(payload) {
    return instance({
      method: "POST",
      url: "/" + url,
      data: payload,
    });
  };

  const put = function put(id, payload) {
    return instance({
      method: "PUT",
      url: "/" + url + "/" + id,
      data: payload,
    });
  };

  const _delete = function _delete(id) {
    return instance({
      method: "DELETE",
      url: "/" + url + "/" + id,
    });
  };

  return { get, post, put, _delete };
}

export default ApiCaller;
