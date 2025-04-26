import { useEffect } from "react";
import axios from "axios";
import { setAllAppliedJobs } from "../redux/jobSlice";
import { APPLICATION_API_END_POINT } from "../utils/constant.js";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        // Retrieve the JWT token from localStorage (or cookies)
        const token = localStorage.getItem("token"); // Or from cookies, if applicable

        // Make the request with the Authorization header
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token
          },
          withCredentials: true, // Ensure cookies are sent if required
        });

        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs;
