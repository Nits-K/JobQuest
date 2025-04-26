import axios from "axios";
import { useEffect } from "react";
import { COMPANY_API_END_POINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../redux/companySlice";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        // Retrieve the JWT token from localStorage (or cookies)
        const token = localStorage.getItem("token"); // Or from cookies, if applicable

        // Make the request with the Authorization header
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the JWT token
            },
            withCredentials: true, // Ensure cookies are sent if required
          }
        );

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (companyId) {
      fetchSingleCompany();
    }
  }, [companyId, dispatch]);
};

export default useGetCompanyById;
