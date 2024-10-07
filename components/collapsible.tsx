"use client";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function DentalClinicFAQ() {
  const faqs = [
    {
      question: "How can I add money to my account?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.",
    },
    {
      question: "How do I get started with card payments?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.",
    },
    {
      question: "How is my document data stored/secured?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.",
    },
    {
      question: "Can I get a standard card for free?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.",
    },
    {
      question: "I do not want to pay now, how can I proceed?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.",
    },
    {
      question: "I don't have the required documents, how can I proceed?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.",
    },
  ];

  return (
    <div className="faq-container  my-8  p-4">
      <h2 className="text-3xl font-semibold mb-6">FAQs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <Card key={index} className="faq-item border p-4">
            <CardHeader className="font-medium text-lg">
              {faq.question}
            </CardHeader>
            <CardContent className="text-gray-700 mt-2">
              {faq.answer}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
