import { ReactNode } from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
type SkeletonProps = {
  children: ReactNode;
};
export function BentoGridDemo() {
  return (
    <div className="max-w-7xl mx-auto">
      <div id="services" className="flex justify-between gap-4 mb-8">
        <h2 className="mt-10 scroll-m-20 pb-2 text-4xl font-semibold tracking-tight transition-colors first:mt-0 ">
          Our Services
        </h2>
        <p className="text-md text-muted-foreground w-1/2">
          Here at Lobodent, we offer a comprehensive range of dental care
          solutions designed to keep your smile healthy and bright. Explore our
          services and experience top-quality care tailored just for you.
        </p>
      </div>

      <BentoGrid className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
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

const items = [
  {
    title: "Dental Consultation",
    description:
      "Receive personalized dental advice and care tailored to your oral health needs.",
    header: (
      <Skeleton>
        <img
          src="/images/services/consultation.jpg"
          alt="Dental Consultation"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Dental Cleaning",
    description:
      "Keep your smile bright and your teeth healthy with professional dental cleaning.",
    header: (
      <Skeleton>
        <img
          src="/images/services/cleaning.jpg"
          alt="Dental Cleaning"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Dental Fillings",
    description:
      "Restore damaged teeth and maintain a natural look with our high-quality fillings.",
    header: (
      <Skeleton>
        <img
          src="/images/services/filling.png"
          alt="Dental Fillings"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Orthodontic Treatment/Braces",
    description:
      "Achieve a straighter smile with our advanced braces and orthodontic treatments.",
    header: (
      <Skeleton>
        <img
          src="/images/services/braces.jpg"
          alt="Braces"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Wisdom Tooth Removal",
    description:
      "Experience safe and effective wisdom tooth extraction to prevent future dental issues.",
    header: (
      <Skeleton>
        <img
          src="/images/services/wisdom.png"
          alt="Wisdom Tooth Removal"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Root Canal Treatment",
    description:
      "Save your natural teeth and alleviate pain with expert root canal treatments.",
    header: (
      <Skeleton>
        <img
          src="/images/services/root.jpg"
          alt="Root Canal Treatment"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Tooth Extraction",
    description:
      "Remove problematic teeth with minimal discomfort and optimal care.",
    header: (
      <Skeleton>
        <img
          src="/images/services/extract.jpg"
          alt="Tooth Extraction"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Laser Teeth Whitening",
    description:
      "Brighten your smile with our safe and effective laser teeth whitening treatments.",
    header: (
      <Skeleton>
        <img
          src="/images/services/laser.jpg"
          alt="Laser Teeth Whitening"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Removable Partial Denture",
    description:
      "Regain your confidence with custom-fitted, removable partial dentures.",
    header: (
      <Skeleton>
        <img
          src="/images/services/denture.jpg"
          alt="Removable Partial Denture"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
  {
    title: "Veneers, Crowns, and Bridges",
    description:
      "Enhance your smile and restore damaged teeth with veneers, crowns, and bridges.",
    header: (
      <Skeleton>
        <img
          src="/images/services/veneers.jpg"
          alt="Veneers"
          className="object-cover w-full h-full rounded-xl"
        />
      </Skeleton>
    ),
  },
];
