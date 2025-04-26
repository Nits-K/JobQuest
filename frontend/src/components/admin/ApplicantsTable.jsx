import React from "react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "../../utils/constant.js";

const shortlistingStatus = ["accepted", "rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      const token = localStorage.getItem("authToken"); // ✅ Get token

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Pass token in headers
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants?.applications?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item?.applicant?.fullName}</TableCell>
              <TableCell>{item?.applicant?.email}</TableCell>
              <TableCell>{item?.applicant?.phoneNumber}</TableCell>
              <TableCell className="text-blue-600 cursor-pointer">
                <a
                  href={item?.applicant?.profile?.resumeOriginalName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item?.applicant?.profile?.resumeOriginalName}
                </a>
              </TableCell>
              <TableCell>{item?.applicant?.createdAt?.split("T")[0]}</TableCell>
              <TableCell className="float-right">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="float-right cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32 cursor-pointer">
                    {shortlistingStatus.map((status, index) => (
                      <div
                        onClick={() => statusHandler(status, item?._id)}
                        key={index}
                        className="flex w-fit hover:underline"
                      >
                        <span>{status}</span>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
