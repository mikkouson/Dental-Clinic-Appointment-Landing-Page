"use client";
import { useService } from "@/components/hooks/useService";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ReactNode } from "react";
import { Service } from "../schema";

type SkeletonProps = {
  children: ReactNode;
};

export default function ServicePage() {
  const { services, serviceError, serviceLoading } = useService();

  if (serviceLoading) return <div>Loading...</div>;
  if (serviceError) return <div>Error loading services</div>;

  // Ensure services is treated as an array and take only first 7

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div
        id="services"
        className="flex-col flex justify-between gap-4 mb-8 sm:flex-row"
      >
        <h2 className="mt-10 scroll-m-20 pb-2 text-4xl font-semibold tracking-tight transition-colors first:mt-0 text-center">
          Our Services
        </h2>
        <p className="text-md text-muted-foreground w-1/2 hidden sm:block">
          Here at Lobodent, we offer a comprehensive range of dental care
          solutions designed to keep your smile healthy and bright. Explore our
          services and experience top-quality care tailored just for you.
        </p>
      </div>

      <BentoGrid className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services &&
          services.map((service: Service) => (
            <BentoGridItem
              key={service.id}
              title={service.name || ""}
              description={service.description || ""}
              header={
                <Skeleton>
                  {service.service_url ? (
                    <img
                      src={service.service_url}
                      alt={service.name || ""}
                      className="object-cover w-full h-full rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/400/300";
                      }}
                    />
                  ) : (
                    <img
                      src="/api/placeholder/400/300"
                      alt={service.name || ""}
                      className="object-cover w-full h-full rounded-xl"
                    />
                  )}
                </Skeleton>
              }
            />
          ))}
      </BentoGrid>
    </div>
  );
}

const Skeleton = ({ children }: SkeletonProps) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    {children}
  </div>
);
