import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock } from "lucide-react";

const LoadingSkeleton = () => {
  return (
    <div className="w-full px-4 py-8 bg-white">
      <Tabs defaultValue="details" className="mx-auto">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-200">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-gray-800"
            >
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Latest appointment</span>
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-gray-800"
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Appointments History</span>
            </TabsTrigger>
            <TabsTrigger
              value="odontogram"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-gray-800"
            >
              {/* <Teeth className="h-4 w-4 mr-2" /> */}
              <span className="hidden lg:inline">Odontogram</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <TabsContent value="details">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <CardHeader className="bg-yellow-50 text-gray-800 p-6 border-b border-yellow-200">
              <CardTitle className="text-2xl font-bold">
                <Skeleton className="h-8 w-72" />
              </CardTitle>
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-6">
                  <div className="flex-1 space-y-4">
                    {[...Array(4)].map((_, index) => (
                      <DetailItemSkeleton key={`left-${index}`} />
                    ))}
                  </div>
                  <Separator
                    orientation="vertical"
                    className="hidden md:block bg-yellow-200"
                  />
                  <div className="flex-1 space-y-4 mt-4 md:mt-0">
                    {[...Array(4)].map((_, index) => (
                      <DetailItemSkeleton key={`right-${index}`} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <CardHeader className="bg-yellow-50 text-gray-800 p-6 border-b border-yellow-200">
              <CardTitle className="text-2xl font-bold">
                <Skeleton className="h-8 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={`row-${index}`} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DetailItemSkeleton = () => {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="h-5 w-5 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
