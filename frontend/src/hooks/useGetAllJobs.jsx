import axios from "axios";
import { useEffect } from "react";
import { JOB_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "../redux/jobSlice";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        // Retrieve the JWT token from localStorage (or cookies if you're using them)
        const token = localStorage.getItem("token"); // or from cookies
        
        const queryParam = searchedQuery ? `?keyword=${searchedQuery}` : '';
        
        // Make the request with the Authorization header
        const res = await axios.get(`${JOB_API_END_POINT}/get${queryParam}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token
          },
          withCredentials: true, // Ensure cookies are sent if required
        });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllJobs();
  }, [searchedQuery, dispatch]);
};

export default useGetAllJobs;
