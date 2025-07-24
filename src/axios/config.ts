import axios from "axios";
import { config } from "../constants/constants";

export const api = axios.create({
  baseURL: config.dev.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});