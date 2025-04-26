import axios from "axios";
import { useEffect } from "react";
import { JOB_API_END_POINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setAllAdminJobs } from "../redux/jobSlice";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        // Retrieve the JWT token from localStorage (or cookies if you're using them)
        const token = localStorage.getItem("token"); // or from cookies
        
        const res = await axios.get(`${JOB_API_END_POINT}/getadminJobs`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the request headers
          },
          withCredentials: true, // Ensure cookies are sent if required
        });

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAdminJobs();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
