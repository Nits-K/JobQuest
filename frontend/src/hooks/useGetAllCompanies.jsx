import axios from "axios";
import { useEffect } from "react";
import { COMPANY_API_END_POINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setCompanies } from "../redux/companySlice";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Retrieve the JWT token from localStorage (or cookies if you're using them)
        const token = localStorage.getItem("token"); // or from cookies
        
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token to the request headers
            },
            withCredentials: true, // Ensure cookies are sent if required
          }
        );

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanies();
  }, [dispatch]);
};

export default useGetAllCompanies;
