import React from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const FieldSkeleton = () => {
  return (
    <Card className="overflow-hidden w-full">
      <CardHeader className="flex flex-row items-start ">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4  w-3/5 mb-4" />
        <Skeleton className="h-56 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
      </CardContent>
    </Card>
  );
};

export default FieldSkeleton;
