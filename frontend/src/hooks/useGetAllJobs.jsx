import axios from "axios";
import { useEffect } from "react";
import { JOB_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "../redux/jobSlice";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const {searchedQuery}=useSelector(store=>store.job)
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const queryParam = searchedQuery ? `?keyword=${searchedQuery}` : '';
        const res = await axios.get(`${JOB_API_END_POINT}/get${queryParam}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error.res.data);
      }
    };
    fetchAllJobs();
  }, [searchedQuery,dispatch]);
};

export default useGetAllJobs;
