import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Noida", "Mumbai", "Hyderabad", "Pune"],
  },
  {
    filterType: "Role",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "Data Scientist",
    ],
  },
  {
    filterType: "Salary",
    array: ["100k-42k", "42-1lakh", "1lakh-5lakh"],
  },
];

const FilterCard = () => {
  const [selectedValue,setSelectedValue]=useState('');
  const dispatch=useDispatch();
  const changeHandler=(value)=>{
    setSelectedValue(value);
  }
  useEffect(()=>{
    dispatch(setSearchedQuery(selectedValue));
  },[selectedValue])
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={changeHandler}>
        {filterData.map((data, index) => {
          return (
            <div key={index}>
              <h1 className="font-bold text-lg">{data.filterType}</h1>
              {data.array.map((item, idx) => {
                const itemId=`r${index}-${idx}`;
                return (
                  <div className="flex items-center space-x-2 my-2">
                    <RadioGroupItem value={item} id={itemId}/>
                    <Label htmlFor={itemId}>{item}</Label>
                  </div>
                );
              })}
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
