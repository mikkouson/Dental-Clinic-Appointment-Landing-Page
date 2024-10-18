import * as React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";

export function CarouselSize() {
  return (
    <div className="w-full mt-16">
      <div className="flex justify-between gap-4 mb-">
        <h2 className="mt-10 scroll-m-20 pb-2 text-4xl font-semibold tracking-tight transition-colors first:mt-0 ">
          What do our patients say?
        </h2>
        <p className="text-md text-muted-foreground w-1/2">
        Here at Lobodent, patient satisfaction is at the heart of everything we do. 
        Hear from our patients about their experiences and how our team has helped them achieve healthy, confident smiles.
        </p>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 6 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/2 md:basis-1/3 mt-10"
            >
              <Quote className="w-16 h-16 text-[#fde89671]  " />
              <div className="p-1">
                <Card className="border-none">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src={`/images/feedbacks/feedback-${index + 1}.png`}
                      alt={`Client feedback ${index + 1}`}
                      width={500}
                      height={500}
                      className=""
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
