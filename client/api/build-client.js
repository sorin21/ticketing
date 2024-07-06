import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // window obj exists only in the browser
    // doesn't exist in nodejs
    // so if window is undefined we are on server
    // We are on the server
    // Create a preconfigured version of Axios
    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClient;
