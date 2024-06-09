"use client";

import fetcher from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiUpvote as UpvoteIcon } from "react-icons/bi";
import { BiDownvote as DownvoteIcon } from "react-icons/bi";
import { Button, Textarea } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PostTypes = {
  _id: string;
  title: string;
  content: string;
  description: string;
  madeBy: { userId: string; fullname: string };
  upvotes: number;
  downvotes: number;
};

const data = [
  {
    _id: "snpt001",
    title: "QuickSort Algorithm in Python",
    content:
      "def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)",
    description: "An efficient sorting algorithm implemented in Python.",
    madeBy: {
      userId: "u12345",
      fullname: "Alice Johnson",
    },
    upvotes: 124,
    downvotes: 3,
  },
  {
    _id: "snpt002",
    title: "Responsive Navbar using HTML and CSS",
    content:
      '<nav>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#services">Services</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>\n<style>\nnav ul {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n  background-color: #333;\n}\nnav ul li {\n  float: left;\n}\nnav ul li a {\n  display: block;\n  color: white;\n  text-align: center;\n  padding: 14px 16px;\n  text-decoration: none;\n}\nnav ul li a:hover {\n  background-color: #111;\n}\n</style>',
    description: "A simple responsive navigation bar using HTML and CSS.",
    madeBy: {
      userId: "u67890",
      fullname: "John Smith",
    },
    upvotes: 89,
    downvotes: 5,
  },
  {
    _id: "snpt003",
    title: "Basic To-Do List App in JavaScript",
    content:
      '<!DOCTYPE html>\n<html>\n<body>\n<h2>To-Do List</h2>\n<input type="text" id="myInput" placeholder="Title...">\n<button onclick="newElement()">Add</button>\n<ul id="myUL">\n</ul>\n<script>\nfunction newElement() {\n  var li = document.createElement("li");\n  var inputValue = document.getElementById("myInput").value;\n  var t = document.createTextNode(inputValue);\n  li.appendChild(t);\n  if (inputValue === \'\') {\n    alert("You must write something!");\n  } else {\n    document.getElementById("myUL").appendChild(li);\n  }\n  document.getElementById("myInput").value = "";\n}\n</script>\n</body>\n</html>',
    description:
      "A simple to-do list application built with JavaScript, HTML, and CSS.",
    madeBy: {
      userId: "u11223",
      fullname: "Mary Lee",
    },
    upvotes: 102,
    downvotes: 2,
  },
  {
    _id: "snpt004",
    title: "REST API with Node.js and Express",
    content:
      "const express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(port, () => {\n  console.log(`Example app listening at http://localhost:${port}`);\n});",
    description:
      "A basic setup of a REST API using Node.js and Express framework.",
    madeBy: {
      userId: "u33445",
      fullname: "David Brown",
    },
    upvotes: 78,
    downvotes: 6,
  },
  {
    _id: "snpt005",
    title: "FizzBuzz in Java",
    content:
      'public class FizzBuzz {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 100; i++) {\n      if (i % 3 == 0 && i % 5 == 0) {\n        System.out.println("FizzBuzz");\n      } else if (i % 3 == 0) {\n        System.out.println("Fizz");\n      } else if (i % 5 == 0) {\n        System.out.println("Buzz");\n      } else {\n        System.out.println(i);\n      }\n    }\n  }\n}',
    description:
      "A Java program to print numbers from 1 to 100 with FizzBuzz logic.",
    madeBy: {
      userId: "u55667",
      fullname: "Emma Wilson",
    },
    upvotes: 67,
    downvotes: 4,
  },
];

export default function Posts() {
  const router = useRouter();
  // const { data, isError, isPending } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: async () => await fetcher.get("/posts/get-posts"),
  // });

  // // TODO: Add better loading and error states
  // if (isPending) return "Loading...";
  // if (isError) return "Erorr";

  return (
    <div className="flex flex-col gap-4">
      {data.map((post: PostTypes) => (
        <Card key={post._id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex gap-1">
              {/* FIXME: Change to solid verison of these icons when clicked */}
              <UpvoteIcon className="h-6 w-6" />
              {post.upvotes - post.downvotes}
              <DownvoteIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="">
                <Link href={`/post/${post._id}`}>{post.title}</Link>
              </CardTitle>
              <CardDescription>{post.madeBy.fullname}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* <Textarea
              isReadOnly
              label="Code"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your description"
              defaultValue={post.content}
              className="min-h-full"
            /> */}
            <p>{post.description}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p>Posted in {post._id} community</p>
            <Button
              variant="solid"
              className="w-full rounded-[20px] bg-primary text-white"
              onClick={() => router.push(`/post/${post._id}`)}
            >
              Show code
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
